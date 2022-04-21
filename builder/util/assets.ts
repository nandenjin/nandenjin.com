import { cpus } from 'os'
import { promises as fs, Dirent } from 'fs'
import { createHash } from 'crypto'
import { join, resolve, dirname, relative } from 'path'
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

  const tasks: { ent: Dirent; entPath: string }[] = []

  /** ディレクトリ内のエントリを再帰的に探索する */
  const findEntry = async (path: string) => {
    const ents = await fs.readdir(path, { withFileTypes: true })

    for (const ent of ents) {
      const entPath = join(path, ent.name)

      if (ent.name.match(/^\./)) {
        continue
      }
      if (ent.isDirectory()) {
        await findEntry(entPath)
      } else if (ent.isFile()) {
        tasks.push({ ent, entPath })
      }
    }
  }

  await findEntry(src)

  // 書き出し先の作成
  await fs.mkdir(cacheDir, { recursive: true })

  const taskLength = tasks.length
  let errorCount = 0
  let succeedCount = 0
  const errors: { e: Error; entPath: string }[] = []
  const updateProgress = () =>
    process.stderr.write(
      `\rBuilding assets: ${succeedCount} completed and ${errorCount} failed in ${taskLength} entries.`
    )
  const taskProducer = () => {
    const task = tasks.shift()
    if (!task) {
      return
    }

    const { ent, entPath } = task

    return (async (ent, entPath) => {
      try {
        const fileContent = await fs.readFile(entPath)
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
          if (cache.hashes[entPath]) {
            try {
              // ハッシュが一致するか
              if (hashString === cache.hashes[entPath]) {
                newCache.hashes[entPath] = cache.hashes[entPath]
                return await fs.readFile(join(cacheDataDir, path))
              }
            } catch (_) {
              return null
            }
          }
          return null
        }

        assetsTmp.push({
          path: relative(src, entPath),
          content: fileContent,
        })

        if (ent.name.match(/^(.+)\.(jpg|png|gif|webp)$/)) {
          const basename = RegExp.$1
          for (const size of SIZES) {
            const dir = dirname(relative(src, entPath))
            const jpgDistPathWithSize = join(dir, `${basename}_${size}w.jpg`)
            const webpDistPathWithSize = join(dir, `${basename}_${size}w.webp`)

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
        }

        // キャッシュの格納
        if (option.cache) {
          newCache.hashes[entPath] = hashString
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
        errors.push({ e, entPath })
        updateProgress()
      }
    })(ent, entPath)
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
