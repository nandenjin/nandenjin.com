<template>
  <main>
    <h1>Kazumi Inada <span style="opacity: 0.3">稲田和巳</span></h1>
    <p><strong>Artist, Technical Director</strong> / hello@nandenjin.com</p>

    <h2>Exhibitions</h2>
    <table>
      <tbody>
        <tr
          v-for="exhibition in events.filter(e => e.is_exhibition)"
          :key="exhibition.slug"
        >
          <td>{{ new Date(exhibition.session_start).getFullYear() }}</td>
          <td>
            <nuxt-link :to="`/events/${exhibition.slug}`">{{
              exhibition.title_ja
            }}</nuxt-link>
            ,
            {{ (exhibition.locations || []).map(x => x.title_ja).join(', ') }}
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Other Events</h2>
    <table>
      <tbody>
        <tr
          v-for="exhibition in events.filter(e => !e.is_exhibition)"
          :key="exhibition.slug"
        >
          <td>{{ new Date(exhibition.session_start).getFullYear() }}</td>
          <td>
            <nuxt-link :to="`/events/${exhibition.slug}`">{{
              exhibition.title_ja
            }}</nuxt-link>
            ,
            {{ (exhibition.locations || []).map(x => x.title_ja).join(', ') }}
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  layout: 'plain',
  head: { title: 'CV' },
  async asyncData({ $content }) {
    const events = await $content('/pages/events')
      .sortBy('session_start', 'desc')
      .fetch()

    return {
      events,
    }
  },
})
export default class CVPage extends Vue {}
</script>

<style lang="sass">
html, body
  font-size: 14px
</style>

<style lang="sass" scoped>
a
  color: inherit
  text-decoration: underline

h1
  font-size: 1.5rem
  margin: 4rem 0 1rem

h2
  font-size: 1.2rem
  margin: 3rem 0 1rem

main
  margin: 0 auto
  max-width: 1000px
  width: calc(100vw - 40px)

th, td
  padding: 0.5rem 0

  &+th, &+td
    padding-left: 1.5rem
</style>
