<template>
  <ul>
    <li><nuxt-link to="/works">Pick up</nuxt-link></li>
    <li><nuxt-link to="/works/tags/art">Art</nuxt-link></li>
    <li><nuxt-link to="/works/tags/design">Design</nuxt-link></li>
    <li><nuxt-link to="/works/tags/web">Web</nuxt-link></li>
    <li><nuxt-link to="/works/tags/stage">Stage</nuxt-link></li>
  </ul>
</template>

<style lang="sass" scoped>
ul
  list-style: none
  padding: 15px 0
  margin: 0

li
  display: inline-block
  text-transform: uppercase
  margin-right: 10px
  font-size: 14px

  a
    display: inline-block
    padding-bottom: 5px
    color: inherit
    text-decoration: none
    opacity: 0.5
    transition: opacity 0.4s ease-in-out

    &.nuxt-link-exact-active
      opacity: 1
      border-bottom: 1px solid
</style>
