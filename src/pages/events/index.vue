<template>
  <main class="main main-with-margin">
    <content-list :src="pages" mode="events" />
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
    const src = (await $content('pages/events')
      .sortBy('session_start', 'desc')
      .fetch<Page>()) as Page[]
    console.log(src)

    return {
      pages: src
    }
  },
  head: {
    title: 'Events',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Events - Kazumi Inada'
      }
    ]
  },
  components: { ContentList }
})
export default class EventsIndexPage extends Vue {
  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Events'
          }
        ]
      }
    ])
  }
}
</script>
