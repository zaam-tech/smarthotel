<template>
  <section>
    <footer>
      <div class="center">
        <div class="copyright">
          &copy; {{ date }} Zaam Technologies or its affiliates
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      date: new Date().getFullYear(),
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
section {
  border-top: 1px solid rgba(0, 0, 0, 0.11);
  padding: 1rem;
  z-index: 4;
  background: var(--white);
}
footer {
  @include flexCenter;
}
.center {
  width: 50%;
  @include flexColCenter;
}
.copyright {
  font-family: var(--open);
  text-align: center;
  padding: 1rem 0;
}
</style>
