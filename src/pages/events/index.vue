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
import { EventMeta } from '~/types'

type Page = {
  body
} & EventMeta

@Component({
  async asyncData({ $content }) {
    let src = (await $content('pages/events')
      .sortBy('session_start', 'desc')
      .fetch<Page>()) as Page[]

    // Move TBA events (that should be at the end of array) to after upcoming/open events
    const now = new Date()
    const tbaEvents = src.filter(e => !e.session_start)
    const upcomingOrOpenEvents = src.filter(
      e => new Date(e.session_start) > now || new Date(e.session_end) > now
    )
    src.splice(-tbaEvents.length)
    src.splice(upcomingOrOpenEvents.length, 0, ...tbaEvents)

    return {
      pages: src,
    }
  },
  head: {
    title: 'Events',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Events - Kazumi Inada',
      },
    ],
  },
  components: { ContentList },
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
            name: 'Events',
          },
        ],
      },
    ])
  }
}
</script>
