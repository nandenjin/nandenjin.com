<template>
  <main class="maiin doc">
    <ul class="link-list">
      <li v-for="item in pages" :key="item.name" class="item">
        <nuxt-link :to="item.path.replace(/^\/pages/, '')" class="item-content">
          <span class="title">{{ item.title_ja }}</span>
          <span class="date">{{ formatDate(item.release, 'yyyy.MM.dd') }}</span>
        </nuxt-link>
      </li>
    </ul>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { FetchReturn } from '@nuxt/content/types/query-builder'
import { formatDate } from '~/lib/helpers'

@Component({
  async asyncData({ $content }) {
    const src = (await $content('pages/news/index').fetch()) as FetchReturn
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

    const pages = await Promise.all(
      items.map(path => $content(path.replace(/\.md$/, '')).fetch())
    )

    return { pages }
  },

  head() {
    return {
      title: 'News',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'News - Kazumi Inada',
        },
      ],
    }
  },
})
export default class NewsIndexPage extends Vue {
  pages
  formatDate = formatDate

  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'News',
          },
        ],
      },
    ])
  }
}
</script>

<style lang="sass" scoped>

@import '~/assets/style/media.sass'

.link-list
  padding: 0
  list-style: none

  .item
    font-size: 13px
    line-height: 2em
    border: 1px solid #eee
    border-style: solid none
    cursor: pointer

    & + .item
      border-top: none

    .item-content
      display: flex
      padding: 20px 30px
      color: inherit

      +rmq
        display: block
        padding: 20px 15px


      .title
        display: block
        flex: 1 1 auto

      .date
        display: block
        flex: 0 0 auto
        color: #888
        font-family: Helvetica
</style>
