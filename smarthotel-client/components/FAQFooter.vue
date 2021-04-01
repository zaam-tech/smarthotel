<template>
  <footer>
    <div class="top">
      <div class="links">
        <nuxt-link to="/rate">Rate This Page</nuxt-link>
        <nuxt-link to="/support">Get Support</nuxt-link>
        <nuxt-link to="/policies">Policies and Agreements</nuxt-link>
      </div>
      <input name="location" list="language" id="number" v-model="language" class="input">
      <datalist id="language">
        <option value="English" />
      </datalist>
    </div>
    <div class="bottom">
      <span>&copy; {{ year }}</span>,Zaam Technologies Inc and its affliates
    </div>
  </footer>
</template>

<script>
export default {
  data(){
    return {
      language: 'English',
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/mixins/index.scss";
footer{
  border-top:1px solid #f1f3f4;
  padding:2em 4em;
  background:#eee;
  .top{
    @include flex;
    @include center;
    margin-bottom:1.5em;
    .links{
      @include flex;
      @include center;
      a{
        padding:.25em 1em;
        color:var(--primary);
        border-right:2px solid #ccc;
      }
    }
    input{
      margin-left:2em;
    }
  }
  .bottom{
    border-top:1px solid #dadce0;
    color:var(--dark-grey);
    padding:1em;
    padding-top:2em;
  }

}
</style>
