<template>
  <div class="loader">
    <div class="box">
      <div class="spinner"></div>
    </div>
    <h1>Loading</h1>
  </div>
</template>

<script>
import Vue from 'vue'
export default {}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
.loader {
  @include flexColCenter;
  @include centerVariant;
  min-height: 70vh;
  .box {
    @include flexCenterBoth;
    padding: 1em;
    .spinner {
      height: 30px;
      width: 30px;
      background: #fff;
      border-radius: 50%;
      border: 2px solid #2a7fff;
      border-top-color: #fff;
      animation: spinner 600ms linear infinite;
    }
    @keyframes spinner {
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
