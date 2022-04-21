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
  async asyncData({ $content }) {
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

    return {
      pages: await Promise.all(
        items.map(path => $content(path.replace(/\.md$/, '')).fetch())
      ),
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
