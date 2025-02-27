
/*!

=========================================================
* Nuxt Argon Dashboard PRO - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nuxt-argon-dashboard-pro
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

const pkg = require('./package')
console.log('ENV', process.env.NODE_ENV)

module.exports = {
  router: {
    base: '/',
    linkExactActiveClass: 'active'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'CB',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt Argon Dashboard PRO - Premium Admin Nuxt.js & Bootstrap 4 Dashboard' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: 'logo.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700'},
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css', integrity: "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/", crossorigin: "anonymous"}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: false,

  /*
  ** Global CSS
  */
  css: [
    'assets/css/nucleo/css/nucleo.css',
    'assets/sass/argon.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard/dashboard-plugin',
    {src: '~/plugins/dashboard/full-calendar', ssr: false },
    {src: '~/plugins/dashboard/world-map', ssr: false },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    'cookie-universal-nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    headers: {
      common: {
        'Content-Type': 'application/json'
      }
    }
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [
      'vee-validate/dist/rules'
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    },
    extractCSS: process.env.NODE_ENV === 'production',
    babel: {
      plugins: [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ]
      ]
    }
  },

  env: {
    /*baseUrl: 'http://urbano.vigitracklatam.com:3001',
    baseUrlPanel: 'http://urbano.vigitracklatam.com:3001',*/
    baseUrl: process.env.baseUrl || 'http://localhost:3010',
    mapaCredencial: 'AIzaSyDiTYiL8A_yGvPsgRagMcfmp_QcxTPzR-E'
}
}
