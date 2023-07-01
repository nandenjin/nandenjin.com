<template>
  <main class="top-container"></main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  layout: 'plain',
  head: {
    title: 'Kazumi Inada | 稲田和巳',
    meta: [{ hid: 'og:type', property: 'og:type', content: 'website' }],
  },
  fetch(ctx) {
    ctx.redirect('/works')
  },
})
export default class IndexPage extends Vue {}
</script>
