import { resolve, join } from 'path'
import consola from 'consola'
import { Module } from '@nuxt/types'
import { getAssets } from './util/assets'

const builderModule: Module = async function ExampleModule() {
  const workDir = resolve(__dirname, '../content')
  const assetsDir = join(workDir, './assets')

  const assets = await getAssets(assetsDir, { cache: true })
  consola.success('All assets from content repo are now ready')

  this.options.build.plugins?.push({
    apply(compiler) {
      compiler.hooks.emit.tap('assetsBuilder', compilation => {
        for (const { path, content } of assets) {
          compilation.assets[join('content', 'assets', path)] = {
            source: () => content,
            size: () => content.length,
          }
        }
      })
    },
  })
}

export default builderModule
