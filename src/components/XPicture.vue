<template>
  <span class="x-picture" :class="{ 'is-loaded': loaded, 'is-cover': cover }">
    <picture>
      <template v-if="!sizeType && !isExternalSrc">
        <source type="image/webp" :srcset="srcsetWebP" :sizes="sizes" />
        <source type="image/jpeg" :srcset="srcset" :sizes="sizes" />
      </template>
      <img
        v-if="src"
        :src="sizeType ? sized(src, sizeType) : src"
        :alt="alt"
        class="src-img"
        @load="onLoad()"
      />
    </picture>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

const SIZES = [320, 768, 1024, 1600]

/** Convert URL to sized version */
const sized = (src: string, size: number, ext?: string): string => {
  if (src.match(/^(.+)\.(jpg|png|webp|gif)$/)) {
    return `${RegExp.$1}_${size}w.${ext || ''}`
  }
  return src
}

/**
 * Inline image component with auto size detection
 */
@Component
export default class XPicture extends Vue {
  /** Path for source image*/
  @Prop(String) readonly src!: string

  /** Alternate text */
  @Prop(String) readonly alt: string | undefined

  /**
   * sizes attribute for <source> tags, which determinates standard size of assets
   * @example '60vw'
   * @default '100vw'
   */
  @Prop({ default: '100vw' }) readonly sizes!: string

  /** If specified the image stretched and fit with the box */
  @Prop({ default: false }) readonly cover!: boolean

  /** Set size of assets manually */
  @Prop(Number) readonly size!: number
  loaded = false
  sized = sized

  get srcset(): string {
    if (!this.src) {
      return ''
    }
    return SIZES.map(size => `${sized(this.src, size)} ${size}w`).join(',')
  }

  get srcsetWebP(): string {
    if (!this.src) {
      return ''
    }
    this.src.match(/^(.+)\.(jpg|png|webp|gif)$/)
    return SIZES.map(size => `${sized(this.src, size, 'webp')} ${size}w`).join(
      ','
    )
  }

  get isExternalSrc(): boolean {
    return !this.src.match(/^\//)
  }

  get sizeType(): number {
    if (this.size) {
      for (const size of SIZES) {
        if (size > this.size) {
          return size
        }
      }
    }

    return 0
  }

  onLoad(): void {
    this.loaded = true
    this.$emit('load')
  }
}
</script>

<style lang="sass" scoped>
.x-picture
  display: inline-block
  width: 100%
  height: 100%

  &.is-loaded .src-img
    height: auto
    opacity: 1

  &.is-loaded.is-cover .src-img
      height: 100%

  .src-img
    width: 100%
    height: 100%
    object-fit: cover
    opacity: 0
    transition: opacity 1s ease 0s
</style>
