<template>
  <main class="main doc">
    <div class="header">
      <div class="badge">News</div>
      <h1 class="title">
        {{ page.title_ja }}
      </h1>
      <div class="info">{{ formatDate(page.release, 'yyyy.MM.dd') }}</div>
    </div>

    <section class="content">
      <content-renderer :content="page" />
    </section>
    <div class="footer">
      <div class="gray">{{ formatDate(page.release, 'yyyy.MM.dd') }}</div>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
/* eslint camelcase: 0 */

import { Vue, Component } from 'nuxt-property-decorator'
import ContentRenderer from '~/components/ContentRenderer'
import { formatDate } from '~/lib/helpers'

@Component({
  async asyncData({ route, $content }) {
    const id = route.params.id
    const page = await $content('pages/news', id).fetch()

    return {
      page
    }
  },

  components: {
    ContentRenderer
  },

  head(this: NewsPage) {
    return {
      title: `${this.page.title_ja} / ${this.page.title_en}`,

      meta: [
        // ToDo: Description整備
        { hid: 'og:description', property: 'og:description', content: '' },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.page.title_ja} / ${this.page.title_en} - Kazumi Inada`
        },
        { hid: 'og:description', property: 'og:description', content: '' }
      ]
    }
  }
})
export default class NewsPage extends Vue {
  page
  formatDate = formatDate

  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: this.page.title_ja,
        dateModified: new Date(this.page.release).toISOString()
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'News',
            item: process.env.baseUrl + '/news'
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
