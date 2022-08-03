<template>
  <div ref="container" class="list-container" :class="`mode-${mode}`">
    <article
      v-for="content in src"
      :key="content.name"
      class="item"
      :class="
        mode === 'events'
          ? getSessionBadge(content.session_start, content.session_end)
          : null
      "
    >
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
            <div v-if="mode === 'works'" class="year">{{ content.year }}</div>
            <div v-else-if="mode === 'events'" class="session">
              {{
                content.session_start && content.session_end
                  ? formatDate(content.session_start, 'yyyy.MM.dd') +
                    ' - ' +
                    formatDate(content.session_end, 'MM.dd')
                  : 'To be annouced'
              }}
            </div>
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
import { formatDate } from '~/lib/helpers'

interface Content {
  meta: WorkMeta
}

const contentDistRoot = join('/_nuxt', 'content')
type ContentMode = 'works' | 'events'

@Component({})
export default class ContentList extends Vue {
  @Prop() src!: Content[]
  @Prop({ default: 'works' }) mode!: ContentMode
  isDestroyed = false
  loadedFlag = {}
  formatDate = formatDate

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

  getSessionBadge(start: string | Date, end: string | Date): string {
    // If start is not set, treat as "upcoming"
    if (!start) {
      return 'is-upcoming'
    }

    start = start instanceof Date ? start : new Date(start)
    end = end instanceof Date ? end : new Date(end)
    const now = new Date()

    if (end < now) {
      return 'is-ended'
    } else if (start > now) {
      return 'is-upcoming'
    }
    return 'is-open'
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

  &.mode-events > .item .thumbnail::after
    position: absolute
    top: 10px
    left: 10px
    background-color: #fff
    display: inline-block
    padding: 5px 10px
    border-radius: 3px
    font-size: 12px
    font-weight: bold
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1)

  & > .item
    display: inline-block
    transition: transform 0.3s ease 0s

    &:hover
      transform: scale3d(1.05, 1.05, 1)

    & > .link
      display: block
      color: #000

    &.is-ended .thumbnail::after
      display: none
      content: 'Ended'

    &.is-upcoming .thumbnail::after
      content: 'Upcoming'

    &.is-open .thumbnail::after
      content: 'Open'

    .thumbnail
      position: relative
      overflow: hidden
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

      .year,.session
        color: #888
        font-size: 13px
</style>
