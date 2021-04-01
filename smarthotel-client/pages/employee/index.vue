<template>
  <div id="employee-dashboard">
    <TheSidebar :employee="true" />
    <main>
      <AppBar title="Overview" />
      <div class="main">
        <component :is="component"></component>
      </div>
    </main>
  </div>
</template>

<script>
import Vue from 'vue'
import TheSidebar from '../../components/TheSidebar'
import AppMenuCatalogue from '../../components/AppMenuCatalogue'
import AppBar from '../../components/AppBar'
import AppOrders from '../../components/AppOrders'
export default {
  components: {
    AppBar,
    AppOrders,
    AppMenuCatalogue,
    TheSidebar,
  },
  data() {
    return {
      component: 'AppOrders',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/mixins/index.scss';
#employee-dashboard {
  @include flex;
  min-height: 100vh;
}
main {
  @include flex;
  @include relative;
  background: #f7f7f7;
  min-height: 100%;
  width: 100%;
  .main {
    @include flexCol;
    width: 100%;
    background: rgba($color: #f0f0f0, $alpha: 0.2);
  }
}
@media screen and (min-width: 800px) {
  main {
    margin-left: 300px;
  }
}
</style>
