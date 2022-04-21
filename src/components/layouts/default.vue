<template>
  <div class="layout-container">
    <the-header />
    <div class="content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TheHeader from '~/components/TheHeader'

export default {
  components: {
    TheHeader,
  },
}
</script>

<style lang="sass" scoped>
@import '~/assets/style/media.sass'
</style>
