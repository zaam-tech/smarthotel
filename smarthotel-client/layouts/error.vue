<template>
  <section>
    <TheNavbar />
    <div id="lost">
      <div class="lost">
        <h1>404</h1>
        <img :src="img" alt="Lost Tourist" />
        <h2>This Page Doesn't Exist!</h2>
        <h4>It Seems you're Lost</h4>
        <nuxt-link to="/" class="btn">Go To Home</nuxt-link>
      </div>
    </div>
    <AppFooter />
  </section>
</template>

<script>
import TheNavbar from '../components/TheNavbar'
import AppFooter from '../components/AppFooter'
export default {
  layout: 'error-layout',
  components: {
    TheNavbar,
    AppFooter,
  },
  data() {
    return {
      img: '/lost-tourist.png',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#lost {
  margin: 7rem 0 3rem 0;
  @include flexColCenter;
  .lost {
    @include flexColCenterBoth;
    img {
      width: 250px;
      height: auto;
      margin: 20px 0;
    }
    h1 {
      font-family: var(--rob);
      font-size: 4rem;
      font-weight: lighter;
    }
    h2 {
      font-size: 2rem;
      font-weight: lighter;
    }
    h4 {
      margin-bottom: 20px;
      font-size: 15px;
    }
  }
  .btn {
    @include btn-new;
    font-size: initial;
    // border-radius: 5px !important;
    @include flexCenter;
    width: 200px;
  }
}
</style>
