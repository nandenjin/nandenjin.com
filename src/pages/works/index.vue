<template>
  <main class="main main-with-margin">
    <content-list :src="pages" />
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import ContentList from '~/components/ContentList.vue'

interface Page {
  body
}

@Component({
  async asyncData({ $content, query }) {
    const pages: unknown[] = []

    // Filter by query (tag=xxx) param enebled
    if (query.tag?.length > 0) {
      const src = (await $content('pages/works')
        .where({ tags: { $regex: query.tag } })
        .fetch<Page>()) as Page[]
      pages.push(...src)
    }

    // Filter disabled - pick up list
    else {
      const src = (await $content('pages/works/index').fetch<Page>()) as Page

      const items: string[] = []
      const proc = node => {
        if (node.type === 'text') {
          return
        }
        if (node.tag === 'nuxt-link') {
          items.push(node.props.to)
        }
        for (const c of node.children) {
          proc(c)
        }
      }
      proc(src.body)
      pages.push(
        ...(await Promise.all(
          items.map(path => $content(path.replace(/\.md$/, '')).fetch())
        ))
      )
    }

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
  components: { ContentList },
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
