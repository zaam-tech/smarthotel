<template>
  <div id="add-employees">
    <h1 class="heading">Add Employee</h1>
    <app-popup />
    <form-element />
  </div>
</template>

<script>
import Vue from 'vue'
import FormElement from './AppSignup'
import AppPopup from './AppPopup.vue'
import { bus } from '../layouts/default'
export default {
  components: {
    AppPopup,
    FormElement,
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss">
@import '../assets/mixins/index.scss';
#add-employees {
  margin-top: 6em;
  padding: 2em;
  @include flexColCenterBoth;
  .heading {
    @include heading;
  }
  section {
    width: 100%;
    #form.mbtop {
      margin-top: 1em;
    }
  }
}
</style>
