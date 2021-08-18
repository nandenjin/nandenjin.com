<template>
  <header class="header">
    <nuxt-link to="/" class="logo">
      <img src="~/assets/img/kazumi_inada.svg" alt="Kazumi Inada" />
    </nuxt-link>
    <nav class="menu">
      <ul class="in-site">
        <nuxt-link tag="li" to="/works">
          Works
        </nuxt-link>
        <nuxt-link tag="li" to="/profile">
          Profile
        </nuxt-link>
        <nuxt-link tag="li" to="/news">
          News
        </nuxt-link>
        <nuxt-link tag="li" to="/events">
          Events
        </nuxt-link>
      </ul>
      <ul class="social">
        <li class="icon icon--twitter">
          <a
            href="https://twitter.com/nandenjin"
            target="_blank"
            rel="noopener noreferrer"
            >Twitter</a
          >
        </li>
        <li class="icon icon--instagram">
          <a
            href="https://instagram.com/nandenjin"
            target="_blank"
            rel="noopener noreferrer"
            >Instagram</a
          >
        </li>
        <li class="icon icon--github">
          <a
            href="https://github.com/nandenjin"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub</a
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class TheHeader extends Vue {
  opened = false
}
</script>

<style lang="scss" scoped>
@import '~/assets/style/media.sass';

.header {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-gap: 55px;
  // max-width: 1000px;
  width: calc(100vw - 50px * 2);
  margin: 50px auto;

  @include rmq() {
    display: block;
    width: calc(100vw - 25px * 2);
  }

  * {
    vertical-align: middle;
  }

  .logo {
    display: inline-block;
    width: 200px;
    transform: translateY(7px);

    @include rmq() {
      display: block;
    }
  }

  .menu {
    display: inline-flex;

    @include rmq() {
      margin-top: 30px;
    }

    .in-site,
    .social {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        display: inline-block;
        font-size: 14px;
        letter-spacing: 0.1em;
        cursor: pointer;
      }
    }

    .in-site {
      flex: 1 1 auto;

      li {
        margin-right: 25px;
        text-transform: uppercase;
        padding: 7px 0px 3px;
        border-bottom: 1px solid transparent;

        &.nuxt-link-active {
          border-bottom: 1px solid #000;
        }
      }
    }

    .social {
      flex: 0 0 auto;

      @include rmq() {
        display: none;
      }

      li {
        margin-left: 5px;

        a {
          position: relative;
          color: rgba(0, 0, 0, 0);
          user-select: none;
          text-indent: -1000vw;
        }
      }

      .icon {
        display: inline-block;
        width: 26px;
        height: 26px;
        background-size: 17px;
        background-repeat: no-repeat;
        background-position: center;
        overflow: hidden;
      }

      .icon--twitter {
        background-image: url('~assets/img/social-logo-twitter.svg');
      }

      .icon--instagram {
        background-image: url('~assets/img/social-logo-instagram.svg');
      }

      .icon--github {
        background-image: url('~assets/img/social-logo-github.svg');
      }
    }
  }
}
</style>
