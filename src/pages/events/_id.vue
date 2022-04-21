<template>
  <main class="main doc">
    <div class="header">
      <div class="badge">Events</div>
      <h1 class="title">
        {{ page.title_ja }}
      </h1>

      <p>
        {{
          page.session_start
            ? formatDate(page.session_start, 'yyyy.MM.dd') +
              '-' +
              (page.session_end
                ? formatDate(page.session_end, 'yyyy.MM.dd')
                : '')
            : 'To be annouced'
        }}
      </p>

      <nav class="toc">
        <a href="#info">開催概要</a>
        <a v-if="relatedWorks && relatedWorks.length > 0" href="#works"
          >出展作品</a
        >
      </nav>
    </div>
    <div class="content">
      <section>
        <content-renderer :content="page" />
      </section>

      <section v-if="relatedWorks && relatedWorks.length > 0">
        <h2 id="works">Works</h2>
        <ul class="related-works-list">
          <li v-for="w in relatedWorks" :key="w.id">
            <x-picture
              :src="toContentURL(w.thumbnail)"
              alt=""
              class="thumbnail"
            />
            <div class="text">
              <nuxt-link :to="`/works/${w.slug}`">
                <div class="ja">{{ w.title_ja }}</div>
                <div class="en">{{ w.title_en }}</div>
              </nuxt-link>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 id="info">Info</h2>
        <p>{{ page.title_ja }}</p>
        <table class="event-info">
          <tbody>
            <tr v-if="page.session_start || page.session_end">
              <th>開催期間</th>
              <td>
                {{
                  page.session_start
                    ? formatDate(page.session_start, 'yyyy.MM.dd')
                    : ''
                }}
                -
                {{
                  page.session_end
                    ? formatDate(page.session_end, 'yyyy.MM.dd')
                    : ''
                }}
              </td>
            </tr>
            <tr v-if="page.locations && page.locations.length > 0">
              <th>場所</th>
              <td>
                <span
                  class="location"
                  v-for="location in page.locations"
                  :key="location.title_ja"
                >
                  <span class="title">{{ location.title_ja }}</span>
                  <embed-map
                    class="map"
                    v-if="location.lat && location.lng"
                    :lat="location.lat"
                    :lng="location.lng"
                /></span>
              </td>
            </tr>
            <tr v-if="(page.external_infos || []).length > 0">
              <th>外部サイト</th>
              <td>
                <ul class="external-infos">
                  <li v-for="info in page.external_infos" :key="info.title">
                    <a :href="info.url">{{ info.title_ja }}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div class="footer"></div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import { FetchReturn } from '@nuxt/content/types/query-builder'
import { Vue, Component } from 'nuxt-property-decorator'
import ContentRenderer from '~/components/ContentRenderer'
import XPicture from '~/components/XPicture.vue'
import EmbedMap from '~/components/EmbedMap.vue'
import { formatDate, toContentURL } from '~/lib/helpers'
import { WorkMeta } from '~/types'

@Component({
  async asyncData({ route, $content, error }) {
    try {
      const id = route.params.id
      const page = (await $content('pages/events', id).fetch()) as FetchReturn

      const relatedWorks = await $content('pages/works')
        .where({ slug: { $in: page.related_works } })
        .fetch()

      return {
        page,
        relatedWorks,
      }
    } catch (e) {
      if (e instanceof Error && e.message.match(/not found/i)) {
        error({ statusCode: 404 })
      } else {
        error({
          statusCode: 500,
          message:
            e instanceof Error
              ? e.toString()
              : `Non-error object was thrown: ${typeof e}`,
        })
      }
    }
  },

  components: {
    ContentRenderer,
    XPicture,
    EmbedMap,
  },

  head(this: EventPage) {
    return {
      title: `${this.page.title_ja} / ${this.page.title_en}`,

      meta: [
        // ToDo: description実装
        { hid: 'description', property: 'description', content: '' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.page.title_ja} / ${this.page.title_en} - Kazumi Inada`,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.baseUrl + '/_nuxt/content' + this.page.thumbnail,
        },
        { hid: 'og:description', property: 'og:description', content: '' },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image',
        },
      ],
    }
  },
})
export default class EventPage extends Vue {
  page
  relatedWorks!: WorkMeta[]

  toContentURL = toContentURL
  formatDate = formatDate

  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: this.page.title_ja,
        // dateModified: new Date(this.page.release).toISOString()
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Events',
            item: process.env.baseUrl + '/events',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: this.page.title_ja,
            item: process.env.baseUrl + this.$route.path,
          },
        ],
      },
    ])
  }
}
</script>

<style lang="sass" scoped>
@import '~assets/style/media.sass'

.toc
  a
    display: inline-block
    padding: 4px 30px
    border: 1px solid #444
    margin-right: 5px
    font-size: 13px
    color: #000

    &::after
      content: ''
      display: inline-block
      border: 1px solid #000
      border-width: 1px 1px 0 0
      margin-left: 7px
      width: 5px
      height: 5px
      transform: rotate(-225deg)
      vertical-align: 2px

.event-info
  td,th
    padding: 7px 15px
    vertical-align: middle
  th
    text-align: center
    // font-weight: bold
    color: #888

.related-works-list
  list-style: none
  padding: 0

  li
    position: relative
    display: grid
    grid-template-columns: 300px 1fr
    grid-gap: 50px
    margin: 30px 0

    @include rmq()
      grid-template-columns: 1fr
      grid-gap: 15px

    .text
      .en
        font-size: 0.9em
        color: #888

    a
      color: inherit

      &::before
        content: ''
        display: inline-block
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%

.location
  margin: 15px 0

  .title
    margin: 10px 0

  .map
    margin: 10px 0


.external-infos
  display: inline
  margin: 0
  padding: 0
</style>
