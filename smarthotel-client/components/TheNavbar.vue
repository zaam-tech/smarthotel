<template>
  <div class="header">
    <div class="links-wrapper">
      <div class="menu">
        <span class="material-icons menu-icon" @click="showLinks">menu</span>
      </div>
      <div class="brand">
        <nuxt-link to="/">
          <img src="/logo.svg" alt="app logo" />
        </nuxt-link>
      </div>
      <div class="nav-links">
        <nuxt-link to="/how-it-works" class="link">How it works</nuxt-link>
        <nuxt-link to="/grow" class="link">Grow your business</nuxt-link>
        <nuxt-link to="/help" class="link">Get Help</nuxt-link>
        <nuxt-link to="/signup" class="link">Signup</nuxt-link>
        <nuxt-link to="/about" class="link">About</nuxt-link>
        <nuxt-link to="/contact" class="link">Contact</nuxt-link>
      </div>
      <div class="nav-links mobile" :class="{ show }">
        <nuxt-link to="/how-it-works" class="link">How it works</nuxt-link>
        <nuxt-link to="/grow" class="link">Grow your business</nuxt-link>
        <nuxt-link to="/help" class="link">Get Help</nuxt-link>
        <nuxt-link to="/signup" class="link">Signup</nuxt-link>
        <nuxt-link to="/about" class="link">About</nuxt-link>
        <nuxt-link to="/contact" class="link">Contact</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../layouts/default.vue'
export default {
  data() {
    return {
      show: false,
    }
  },
  methods: {
    redirect() {
      bus.$emit('showComponent', 'index')
      const router = this.$router
      router.push({ name: 'index' })
    },
    showLinks() {
      this.show = !this.show
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
.header {
  background: var(--white);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 5;
  box-shadow: 5px 0 10px rgba(5, 5, 5, 0.2);
}
.home {
  background: transparent;
  box-shadow: none !important;
  .link {
    color: var(--white) !important;
    &:after {
      background: var(--white);
    }
  }
  .btn {
    background: var(--white);
    color: var(--primary) !important;
    border: 1px solid var(--white);
    &:hover {
      background: transparent;
      color: var(--white) !important;
      // border-color:var(--white);
    }
  }
}
.links-wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 10px 20px;
  @include flexSpace;
}
a {
  color: var(--darkBluey) !important;
  font-size: 0.95em !important;
  font-weight: normal;
  font-family: var(--open);
  text-transform: capitalize;
  letter-spacing: 1px;
}
.menu {
  display: none;
  padding: 0.2em 0.5em;
  background: var(--white);
  color: var(--dark);
  @include absolute;
  right: 5%;
  top: 20px;
  .material-icons {
    font-size: 30px;
    cursor: pointer;
  }
}

.nav-links {
  @include flexCenterBoth;
}
.nav-links.mobile {
  display: none;
}
.show {
  @include flexCol;
  display: flex !important;
}
.btn {
  @include btn-new;
  border-radius: 10px;
  &:hover {
    background: var(--white);
    color: var(--primary) !important;
  }
}
.link {
  padding: 0px 10px;
  position: relative;
  font-size: 16px;
  font-weight: 700;
  color: var(--white);
  &:after {
    content: '';
    width: 60%;
    transform: scale(0);
    height: 2px;
    bottom: -15px;
    left: 8%;
    position: absolute;
    transform-origin: left;
    background: var(--darkBluey);
  }
}
.link:not(:last-of-type) {
  margin-right: 10px;
}

.link:hover:after {
  transform: scale(1);
  transition: 0.3s all linear;
}
@media screen and (max-width: 600px) {
  .brand,
  .nav-links {
    justify-content: flex-start;
    align-items: flex-start;
  }
  .nav-links {
    display: none;
    margin-top: 1em;
    .link {
      margin-right: 0;
      padding: 0.5em;
      font-family: var(--source);
      text-transform: capitalize;
      font-size: 0.9em;
      font-weight: normal;
      &:after {
        display: none;
      }
    }
  }
  .menu {
    @include flex;
  }
  .links-wrapper {
    @include flexCol;
  }
}
</style>
