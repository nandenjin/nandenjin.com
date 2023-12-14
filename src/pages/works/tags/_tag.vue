<template>
  <main class="main main-with-margin">
    <WorksTagFilterSelector />
    <content-list :src="pages" class="content" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

interface Page {
  body
}

@Component({
  async asyncData({ $content, route }) {
    const pages: unknown[] = []
    const tag = route.params.tag

    const src = (await $content('pages/works')
      .where({ tags: { $regex: tag } })
      .sortBy('release', 'desc')
      .fetch<Page[]>()) as Page[]

    pages.push(...src)

    return {
      pages,
    }
  },
  head: {
    title: 'Works',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Works - Kazumi Inada',
      },
    ],
  },
  watchQuery: ['tag'],
})
export default class WorksIndexPage extends Vue {
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
          },
        ],
      },
    ])
  }
}
</script>

<style lang="sass" scoped>
.content
  margin-top: 20px
</style>
