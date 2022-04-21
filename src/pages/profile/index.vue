<template>
  <main class="main doc">
    <div class="profile">
      <div>
        <h1>Kazumi Inada / 稲田 和巳</h1>
        <div class="title">Designer / Engineer</div>
        <content-renderer :content="page" />
      </div>
    </div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="jsonLD" />
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ContentRenderer from '~/components/ContentRenderer'

@Component({
  async asyncData({ $content }) {
    const page = await $content('pages/profile/index').fetch()
    return {
      page,
    }
  },
  head: {
    title: 'Profile',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Profile - Kazumi Inada',
      },
    ],
  },
  components: {
    ContentRenderer,
  },
})
export default class ProfilePage extends Vue {
  get jsonLD(): string {
    return JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        email: 'hello@nandenjin.com',
        name: 'Kazumi Inada',
        birthPlace: 'Osaka, Japan',
        gender: 'male',
        url: 'https://www.nandenjin.com',
        sameAs: [
          'https://www.facebook.com/nandenjin',
          'https://www.linkedin.com/in/nandenjin',
          'https://twitter.com/nandenjin',
          'https://instagram.com/nandenjin',
          'https://github.com/nandenjin',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Profile',
          },
        ],
      },
    ])
  }
}
</script>

<style lang="sass" scoped>

@import '~/assets/style/media.sass'

.profile
  font-size: 13px
  margin: 100px 30px 0
</style>
