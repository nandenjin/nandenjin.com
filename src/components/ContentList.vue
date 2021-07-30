<template>
  <div ref="container" class="list-container">
    <article v-for="content in src" :key="content.name" class="item">
      <nuxt-link class="link" :to="content.path.replace(/^\/pages/, '')">
        <figure>
          <div
            class="thumbnail"
            :class="{ 'is-loaded': loadedFlag[content.thumbnail] }"
          >
            <picture>
              <source
                type="image/webp"
                :srcset="getSrcSet(content.thumbnail, 'webp')"
                sizes="(max-width: 400px) 100vw, 30vw"
              />
              <source
                type="image/jpeg"
                :srcset="getSrcSet(content.thumbnail, 'jpg')"
                sizes="(max-width: 400px) 100vw, 30vw"
              />
              <img
                :src="getSrc(content.thumbnail)"
                alt=""
                @load="$set(loadedFlag, content.thumbnail, true)"
              />
            </picture>
          </div>
          <figcaption class="caption">
            <h2 class="title">{{ content.title_ja }}</h2>
            <div class="year">{{ content.year }}</div>
          </figcaption>
        </figure>
      </nuxt-link>
    </article>
  </div>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import { join } from 'path'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { WorkMeta } from '~/types'

interface Content {
  meta: WorkMeta
}

const contentDistRoot = join('/_nuxt', 'content')

@Component({})
export default class ContentList extends Vue {
  @Prop() src!: Content[]
  isDestroyed = false
  loadedFlag = {}

  getSrc(src: string): string {
    if (!src) {
      return ''
    }
    return join(contentDistRoot, src)
  }

  getSrcSet(src: string, ext: string): string {
    if (!src) {
      return ''
    }
    src.match(/^(.+)\.(jpg|png|webp|gif)$/)
    const base = join(contentDistRoot, RegExp.$1)
    return `${base}_320w.${ext} 320w, ${base}_768w.${ext} 768w, ${base}_1024w.${ext} 1024w, ${base}_1600w.${ext} 1600w`
  }
}
</script>

<style lang="sass" scoped>
@use 'sass:math'
@import '~/assets/style/media.sass'

.list-container
  display: grid
  grid-gap: 50px

  +mq
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))

  & > .item
    display: inline-block
    transition: transform 0.3s ease 0s

    &:hover
      transform: scale3d(1.05, 1.05, 1)

    & > .link
      display: block
      color: #000

    .thumbnail
      position: relative
      overflow: hidden
      border-radius: 7px
      background-color: #eee
      border: 1px solid rgba(0, 0, 0, .05)

      &::before
        content: ''
        display: block
        margin-top: math.div(100%, 8) * 5

      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        object-fit: cover
        opacity: 0
        transition: opacity .5s ease 0s

      &.is-loaded
        img
          opacity: 1

    .caption
      margin-top: 20px

      .title
        margin: 5px 0 10px
        width: 100%
        vertical-align: middle
        font-size: 14px
        overflow-x: hidden
        white-space: nowrap
        text-overflow: ellipsis

      .year
        color: #888
        font-size: 13px
</style>
