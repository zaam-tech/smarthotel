<template>
  <keep-alive>
    <component :is="loading ? loadingComponent : component" />
  </keep-alive>
</template>

<script>
import AppDashboard from '../components/AppDashboard'
import Loading from '../components/loading/index'
import Vue from 'vue'
import { mapActions } from 'vuex'
import redirect from '../utilities/redirect'
import { bus } from '../layouts/default'

export default {
  head() {
    return {
      title: 'Smart Hotel | Dashboard',
    }
  },
  components: {
    AppDashboard,
    Loading,
  },
  data() {
    return {
      component: 'AppDashboard',
      loading: true,
      loadingComponent: 'Loading',
      shown: false,
    }
  },
  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
      getHotel: 'hotel/getHotel',
    }),
  },
  async mounted() {
    try {
      await this.getUser()
      await this.getHotel()
    } catch (error) {
      bus.$emit('showPopup', {
        message: error.message,
        success: false,
      })
    }
    if (process.title === 'browser') {
      if (window && window.localStorage) {
        const userId = localStorage.getItem('userId')
        const user = JSON.parse(localStorage.getItem('user'))
        if (!userId) {
          redirect('/login')
          this.shown = false
        } else if (!user) {
          await this.getUser()
          const newUser = JSON.parse(localStorage.getItem('user'))
          if (!newUser) {
            redirect('/login')
            this.shown = false
          } else {
            this.shown = true
            this.loading = false
          }
        } else {
          this.shown = true
          this.loading = false
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/mixins/index.scss';
#dashboard {
  @include flex;
  min-height: 100vh;
  .loader {
    justify-self: center;
  }
}

#right {
  background: #f7f7f7;
  min-height: 100%;
  @include flex;
  @include relative;
  width: 100%;
  #right-content {
    @include flexCol;
    width: 100%;
    background: rgba($color: #f0f0f0, $alpha: 0.2);
  }
}

/* Mobile styles */

@media (min-width: 800px) {
  #right {
    margin-left: 250px;
  }
}
@media (max-width: 768px) {
  #right-content {
    width: 100% !important;
  }
}
</style>
