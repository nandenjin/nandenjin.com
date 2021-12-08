<template>
  <main>
    <template v-if="error.statusCode === 404">
      <h1>ページが見つかりません</h1>
      <p>サイト内のリンクが壊れている場合はお知らせください。</p>
    </template>
    <template v-else>
      <h1>エラーが発生しました</h1>
      <p>
        ご不便をおかけし申し訳ありません。サイトに不具合が発生しているようです。<br />ご利用中のページと環境、エラーメッセージをご報告ください。
      </p>
      <output class="error" v-if="error.message">{{ error.message }}</output>
    </template>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { NuxtError } from '@nuxt/types'

@Component
export default class ErrorPage extends Vue {
  @Prop({ type: Object, required: true }) error!: NuxtError
}
</script>

<style lang="sass" scoped>
@import '~/assets/style/media.sass'

main
  text-align: center
  max-width: 800px
  margin: 80px auto

h1
  font-size: 1.4em

.error
  display: block
  background-color: #eeeeee
  padding: 15px
  font: normal 12px 'Courier New',monospace
</style>
