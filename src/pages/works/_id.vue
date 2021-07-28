<template>
  <main class="main doc">
    <div class="header">
      <div class="badge">Works</div>
      <h1 class="title">
        {{ page.title_ja }}
      </h1>
      <div class="info">
        {{ page.creator }}, {{ page.year }} / {{ page.materials }}
      </div>
    </div>

    <section class="content">
      <content-renderer :content="page" />
    </section>
    <section class="work-info">
      <div class="text">
        <p class="aside">
          {{ page.materials }}
        </p>
        <p class="creator">{{ page.creator }}, {{ page.year }}</p>
        <p v-if="$data.page.info">
          {{ page.info }}
        </p>
        <ul class="tags">
          <li v-for="tag in tagArray" :key="tag" class="tag">
            {{ tag }}
          </li>
        </ul>
      </div>
    </section>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import { Vue, Component } from 'vue-property-decorator'
import ContentRenderer from '~/components/ContentRenderer'

@Component({
  async asyncData({ route, $content }) {
    const id = route.params.id
    const page = await $content('pages/works', id).fetch()

    return {
      page
    }
  },

  components: {
    ContentRenderer
  },

  head(this: WorkPage) {
    return {
      title: `${this.page.title_ja} / ${this.page.title_en}`,

      meta: [
        // ToDo: description実装
        { hid: 'description', property: 'description', content: '' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.page.title_ja} / ${this.page.title_en} - Kazumi Inada`
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.baseUrl + '/_nuxt/content' + this.page.thumbnail
        },
        { hid: 'og:description', property: 'og:description', content: '' },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ]
    }
  }
})
export default class WorkPage extends Vue {
  page

  get tagArray(): string[] {
    if (!this.page.tags) {
      return []
    }
    return this.page.tags.split(' ')
  }

  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Works',
            item: process.env.baseUrl + '/works'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: this.page.title_ja,
            item: process.env.baseUrl + this.$route.path
          }
        ]
      }
    ])
  }
}
</script>

<style lang="sass">

@import '~/assets/style/media.sass'

.main

  .eye-catch
    margin-top: 15px
    margin-bottom: 15px
    border-radius: 20px

    @include mq(md)
      margin-top: 85px
      margin-bottom: 85px

  .work-info
    width: calc(100vw - 50px * 2)
    max-width: 700px
    margin: 100px auto
    font-size: 13px
    line-height: 1.8em
    color: #888

    @include rmq()
      width: calc(100vw - 25px * 2)

    .text
      p
        margin: 5px 0

    .tags
      margin: 30px 0 0 0
      padding: 0

      .tag
        display: inline-block
        margin: 0 10px 6px 0
        font-family: Helvetica
        font-size: 12px
        color: #888
</style>
