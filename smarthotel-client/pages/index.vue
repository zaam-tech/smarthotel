<template>
  <section>
    <component :is="component"></component>
  </section>
</template>

<script>
import dashboard from './dashboard'
import AppIndex from '../components/AppIndex'
import { bus } from '../layouts/default'
import { mapActions } from 'vuex'
import intlTelInput from 'intl-tel-input';

export default {
  components: {
    dashboard,
    AppIndex,
  },
  data() {
    return {
      component: 'AppIndex',
    }
  },
  created() {
    bus.$on('showComponent', (component) => {
      this.component = component
    })
  },
  methods: {
    ...mapActions({
      getProduct: 'product/getProduct',
      getProducts: 'product/getAllProducts',
    }),
  },
}
</script>
