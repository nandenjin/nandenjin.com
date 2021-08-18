<template>
  <iframe
    class="embed-map"
    style="border:0"
    loading="lazy"
    allowfullscreen
    :src="src"
  >
  </iframe>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class EmbedMap extends Vue {
  @Prop(Number) lat!: number
  @Prop(Number) lng!: number

  get src(): string {
    return `https://www.google.com/maps/embed/v1/place?key=${this.$config.GOOGLE_API_KEY}&q=${this.lat},${this.lng}`
  }
}
</script>

<style lang="sass" scoped>
.embed-map
  width: 100%
  height: 100%
</style>
