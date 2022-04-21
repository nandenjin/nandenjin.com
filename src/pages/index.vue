<template>
  <main class="top-container">
    <image-box
      class="eye-catch"
      src="/_nuxt/content/assets/works/sympathy/sympathy_0.png"
      alt=""
      sizes="(max-width: 768px) 100vw 38vw"
      :cover="true"
    />
    <div class="content">
      <div class="centering">
        <h1>
          <img src="~/assets/img/mini-logo.svg" alt="" class="logo" />
          <img
            src="~/assets/img/kazumi_inada.svg"
            alt="Kazumi Inada"
            class="kazumi-inada"
          />
        </h1>
        <nav class="nav">
          <nuxt-link class="item" to="/works"> Works </nuxt-link>
          <nuxt-link class="item" to="/events"> Events </nuxt-link>
          <nuxt-link class="item" to="/profile"> Profile </nuxt-link>
        </nav>
      </div>
      <nuxt-link tag="section" class="eye-catch-info" to="/works/residents">
        <h3>"Instant Sympathy"</h3>
        <p>I/O (Kazumi Inada + Takuto Okamoto), 2018-2020</p>
      </nuxt-link>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ImageBox from '~/components/ImageBox.vue'

@Component({
  layout: 'plain',
  components: {
    ImageBox,
  },
  head: {
    title: 'Kazumi Inada | 稲田和巳',
    meta: [{ hid: 'og:type', property: 'og:type', content: 'website' }],
  },
})
export default class IndexPage extends Vue {}
</script>

<style lang="sass" scoped>

@import '~/assets/style/media.sass'

.top-container
  display: flex
  height: 100vh
  flex-direction: column

  +mq(md)
    flex-direction: row

.eye-catch
  flex: 1 1 100%
  margin: 0
  padding: 0
  background-color: #000
  background-position: center
  background-size: cover

.content
  position: relative
  flex: 1 1 161%

  .centering
    margin: 50px 40px 30px 40px

    +mq(md)
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      margin: auto 20%
      height: 500px

    .logo
      display: block
      height: 25px
      margin: 30px 0

      +mq(md)
        height: 40px
        margin: 45px 0

    .kazumi-inada
      display: block
      height: 15px
      margin: 25px 0

      +mq(md)
        height: 20px
        margin: 45px 0

    .nav
      .item
        display: inline-block
        margin: 0 25px 0 0
        color: #000
        font-size: 13px
        text-transform: uppercase
        letter-spacing: 0.15em
        transition: color 0.15s ease 0s

        +mq(md)
          font-size: 15px

        &:hover
          color: #aaaaaa

  .eye-catch-info
    position: absolute
    right: 30px
    bottom: 30px

    h3, p
      margin: 0
      padding: 0
      font-size: 9px
      text-align: right

      +mq(md)
        font-size: 11px
</style>
