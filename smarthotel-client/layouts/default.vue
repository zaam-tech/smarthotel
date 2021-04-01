<template>
  <section>
    <nuxt />
  </section>
</template>
<script>
import '../assets/material/material-icons.css'
import Vue from 'vue'
export const bus = new Vue()
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      dynamicTitle: 'Francis Amidu',
    }
  },
  head() {
    return {
      title: 'Smart Hotel | Modern Hotel System For Leading Businesses',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Smart Hotel | A Digital Hotel Management System',
        },
      ],
    }
  },
  async mounted() {
    await this.getCountries()
  },
  methods: {
    ...mapActions({
      getCountries: 'countries/getCountries',
    }),
  },
}
</script>
<style lang="scss">
@import '../assets/themify-icons/themify-icons.css';
@import '../assets/mixins/index.scss';
@import '@/node_modules/vue-ionicons/ionicons.scss';
@import '@/node_modules/intl-tel-input/build/css/intlTelInput.min.css';
.phone-input {
  .iti--allow-dropdown {
    display: block !important;
    transform: translateX(-2.2em);
  }
}
.phone-input-group {
  .iti--allow-dropdown {
    display: block !important;
    transform: translateX(-1.2em);
  }
  .input {
    width: 81% !important;
  }
}
.iti--allow-dropdown {
  z-index: 15 !important;
}
.phone-group {
  .iti--allow-dropdown {
    display: block !important;
    width: 45%;
  }
}
.phone {
  .iti--allow-dropdown {
    .input {
      width: 100% !important;
    }
    width: 70% !important;
  }
  .btn.send {
    width: 65% !important;
  }
}
.red {
  .ion__svg {
    height: 1.4em !important;
    width: 1.4em !important;
    fill: red !important;
  }
}
.info {
  .ion__svg {
    height: 1.4em !important;
    width: 1.4em !important;
    fill: var(--primary);
  }
}
.green {
  .ion__svg {
    height: 1.4em !important;
    width: 1.4em !important;
    fill: var(--green);
  }
}
.orange {
  .ion__svg {
    height: 1.4em !important;
    width: 1.4em !important;
    fill: var(--orange);
  }
}
:root {
  --color: #007fff;
  --open: 'Roboto';
  --mont: 'Montserrat';
  --orange: #ff5500 !important;
  --red: #ff0055 !important;
  --red-variant: #c20404 !important;
  --deep-red: #a00404 !important;
  --green: #1e9461 !important;
  --white: #fff;
  --light_grey: #edeef0;
  --primary: #0055ff;
  --secondary: #00aaff;
  --darkBluey: #293c58;
  --blue-variant: #004297;
  --blue-deep: #073b80;
  --dark: #262d4f;
  --darkVariant: #2c355e;
  --charcoal: #333;
  --dark-grey: #65686b;
  --grey: #b0b1b3;
  --black: #000;
}
html {
  font-family: var(--open), Arial, sans-serif, 'Segoe UI', 'Helvetica Neue' !important;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body {
  overflow-x: hidden;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
a {
  text-decoration: none !important;
  color: #007fff;
}
section {
  position: relative;
}
.brand {
  @include flexCenterBoth;
  a {
    color: var(--dark);
    font-family: var(--open);
    text-transform: uppercase;
    font-size: 24px !important;
    font-weight: bold;
    cursor: pointer;
    @include flexCenterBoth;
    img {
      width: 180px !important;
    }
  }
}
ul {
  padding-left: 0;
}
li {
  list-style: none;
}
.errors {
  @include flexCol;
  margin: 1em 0;
  border: 1.5px solid var(--red-variant);
  border-radius: 5px;
  padding: 1em 2em;
  width: 400px;
  background: var(--white);
  .header {
    @include flex;
    @include center;
    color: var(--red-variant);
    .material-icons {
      margin-right: 1em;
    }
  }
  ul {
    @include flexCol;
    padding-left: 4.5em;
    li {
      list-style-type: initial;
    }
  }
}
#form {
  margin: 2em 0 4em 0 !important;
  .heading {
    margin-bottom: 1.5em;
  }
}
.input,
.form-input {
  padding: 6px;
  height: 30px !important;
}
h1,
h2,
h3 {
  font-family: var(--mont) !important;
}
.border {
  border-top: 1px solid var(--light_grey);
}
.invalid-field {
  padding: 1em 0;
  @include relative;
  .invalid {
    border-color: var(--red-variant);
  }
}
.bp {
  padding: 2em 0;
  border-bottom: 1px solid var(--light_grey);
}
.padd {
  padding: 1em 0;
}
.dropdown-icon {
  .ion__svg {
    fill: var(--dark);
  }
}
</style>
