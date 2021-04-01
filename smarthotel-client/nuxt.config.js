export default {
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  webfontloader: {
    custom: {
      families: ['Roboto', 'Montserrat'],
      urls: [
        'https://fonts.googleapis.com/css?family=Roboto&display=swap',
        'https://fonts.googleapis.com/css2?family=Montserrat&display=swap',
      ],
    },
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    './plugins/vuelidate',
    '~/plugins/vue-ionicons',
    '~/plugins/vue-socketio',
  ],
  server: {
    port: process.env.PORT || 5000,
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  // modules: [
  //   'nuxt-webfontloader',
  //   [
  //     'nuxt-google-maps-module',
  //     {
  //       /* module options */
  //       key: process.env.API_KEY,
  //     },
  //   ],
  // ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    transpile: ['vuelidate'],
    extend(config, ctx) {},
  },
  // plugins: [
  //   { src: '~/plugins/vue-socketio.js' }
  // ],
}
