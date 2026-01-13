import { cpus } from 'os'
import fs from 'fs/promises'
import { createHash } from 'crypto'
import { join, resolve, dirname, relative, basename } from 'path'
import PromisePool from 'es6-promise-pool'
import sharp from 'sharp'
import consola from 'consola'

const SIZES = [1600, 1024, 768, 320]

export interface Asset {
  path: string
  content: Buffer
}

export interface getAssetsCache {
  createdAt: number
  hashes: {
    [key: string]: string
  }
}

export interface getAssetsOption {
  cache?: boolean
}

const cacheDir = resolve(__dirname, '../../node_modules/.cache/builder-module')
const cacheDataDir = join(cacheDir, 'data')
const cacheDbPath = join(cacheDir, 'cache.json')

export async function getAssets(
  src: string,
  option: getAssetsOption = {}
): Promise<Asset[]> {
  const assets: Asset[] = []
  let cache: getAssetsCache = { createdAt: Date.now(), hashes: {} }
  const newCache = { createdAt: Date.now(), hashes: {} }

  if (option.cache) {
    try {
      cache = require(cacheDbPath)
      consola.info(
        `Cache for assets builder enabled! To clean up, remove: ${cacheDbPath}`
      )
    } catch (e) {
      consola.warn(`Failed to load cache data: ${cacheDbPath}`)
      consola.debug(e)
    }
  }

  const files: string[] = []

  /** ディレクトリ内のエントリを再帰的に探索する */
  for await (const ent of fs.glob('**/*.{png,jpg,gif,webp}', {
    cwd: src,
    exclude: ['.*/**/*'],
  })) {
    files.push(join(src, ent))
  }

  // 書き出し先の作成
  await fs.mkdir(cacheDir, { recursive: true })

  const taskLength = files.length
  let errorCount = 0
  let succeedCount = 0
  const errors: { e: Error; entPath: string }[] = []
  const updateProgress = () =>
    process.stderr.write(
      `\rBuilding assets: ${succeedCount} completed and ${errorCount} failed in ${taskLength} entries.`
    )
  const taskProducer = () => {
    const filePath = files.shift()
    if (!filePath) {
      return
    }

    return (async filePath => {
      try {
        const fileContent = await fs.readFile(filePath)
        let hashString = ''
        const assetsTmp: typeof assets = []

        // キャッシュがあれば更新判定する
        if (option.cache) {
          const hash = createHash('md5')
          hash.update(fileContent)
          hashString = hash.digest('base64')
        }

        const getCache = async (path: string) => {
          if (!option.cache) {
            return null
          }
          if (cache.hashes[filePath]) {
            try {
              // ハッシュが一致するか
              if (hashString === cache.hashes[filePath]) {
                newCache.hashes[filePath] = cache.hashes[filePath]
                return await fs.readFile(join(cacheDataDir, path))
              }
            } catch (_) {
              return null
            }
          }
          return null
        }

        assetsTmp.push({
          path: relative(src, filePath),
          content: fileContent,
        })

        const id = basename(filePath).replace(/\.[^/.]+$/, '')
        for (const size of SIZES) {
          const dir = dirname(relative(src, filePath))
          const jpgDistPathWithSize = join(dir, `${id}_${size}w.jpg`)
          const webpDistPathWithSize = join(dir, `${id}_${size}w.webp`)

          const data = sharp(fileContent).clone().resize(size)
          assetsTmp.push({
            path: jpgDistPathWithSize,
            content:
              (await getCache(jpgDistPathWithSize)) ||
              (await data.jpeg().toBuffer()),
          })
          assetsTmp.push({
            path: webpDistPathWithSize,
            content:
              (await getCache(webpDistPathWithSize)) ||
              (await data.webp().toBuffer()),
          })
        }

        // キャッシュの格納
        if (option.cache) {
          newCache.hashes[filePath] = hashString
          for (const { path, content } of assetsTmp) {
            await fs.mkdir(dirname(join(cacheDataDir, path)), {
              recursive: true,
            })
            await fs.writeFile(join(cacheDataDir, path), content)
          }
        }

        assets.push(...assetsTmp)

        succeedCount++
        updateProgress()
      } catch (e) {
        errorCount++
        errors.push({ e: e as Error, entPath: filePath })
        updateProgress()
      }
    })(filePath)
  }

  const pool = new PromisePool(taskProducer, cpus().length)
  await pool.start()

  process.stderr.write('\n')
  for (const { e, entPath } of errors) {
    consola.error(`Failed to convert assets: ${entPath}`)
    consola.log(e)
  }

  if (option.cache) {
    // キャッシュの保存
    try {
      await fs.mkdir(dirname(cacheDbPath), { recursive: true })
      await fs.writeFile(cacheDbPath, JSON.stringify(newCache, null, 2), {
        encoding: 'utf-8',
      })
    } catch (e) {
      consola.debug(e)
      consola.warn('Failed to save asset builder cache.')
    }
  }

  return assets
}
