import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _606bf0bc = () => interopDefault(import('..\\pages\\alternative.vue' /* webpackChunkName: "pages/alternative" */))
const _2e11c7b7 = () => interopDefault(import('..\\pages\\aprobado.vue' /* webpackChunkName: "pages/aprobado" */))
const _53d7180a = () => interopDefault(import('..\\pages\\banco.vue' /* webpackChunkName: "pages/banco" */))
const _77f6253f = () => interopDefault(import('..\\pages\\calendar.vue' /* webpackChunkName: "pages/calendar" */))
const _08767116 = () => interopDefault(import('..\\pages\\charts.vue' /* webpackChunkName: "pages/charts" */))
const _60b61243 = () => interopDefault(import('..\\pages\\comprobante.vue' /* webpackChunkName: "pages/comprobante" */))
const _7d3c02e2 = () => interopDefault(import('..\\pages\\conciliacion.vue' /* webpackChunkName: "pages/conciliacion" */))
const _2a828c3a = () => interopDefault(import('..\\pages\\dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _074a815e = () => interopDefault(import('..\\pages\\libro.vue' /* webpackChunkName: "pages/libro" */))
const _25b6cd2c = () => interopDefault(import('..\\pages\\lock.vue' /* webpackChunkName: "pages/lock" */))
const _615ac7d5 = () => interopDefault(import('..\\pages\\pricing.vue' /* webpackChunkName: "pages/pricing" */))
const _bbc337d0 = () => interopDefault(import('..\\pages\\recuperar.vue' /* webpackChunkName: "pages/recuperar" */))
const _27311e24 = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages/register" */))
const _42724b5c = () => interopDefault(import('..\\pages\\revision.vue' /* webpackChunkName: "pages/revision" */))
const _358f273d = () => interopDefault(import('..\\pages\\usuario.vue' /* webpackChunkName: "pages/usuario" */))
const _62fb0b84 = () => interopDefault(import('..\\pages\\widgets.vue' /* webpackChunkName: "pages/widgets" */))
const _2bfa0cba = () => interopDefault(import('..\\pages\\components\\buttons.vue' /* webpackChunkName: "pages/components/buttons" */))
const _94f47048 = () => interopDefault(import('..\\pages\\components\\cards.vue' /* webpackChunkName: "pages/components/cards" */))
const _0a7778cf = () => interopDefault(import('..\\pages\\components\\grid-system.vue' /* webpackChunkName: "pages/components/grid-system" */))
const _71408013 = () => interopDefault(import('..\\pages\\components\\icons.vue' /* webpackChunkName: "pages/components/icons" */))
const _6bd639e1 = () => interopDefault(import('..\\pages\\components\\notifications.vue' /* webpackChunkName: "pages/components/notifications" */))
const _207ed586 = () => interopDefault(import('..\\pages\\components\\typography.vue' /* webpackChunkName: "pages/components/typography" */))
const _4dd8d414 = () => interopDefault(import('..\\pages\\forms\\components.vue' /* webpackChunkName: "pages/forms/components" */))
const _5e245af5 = () => interopDefault(import('..\\pages\\forms\\elements.vue' /* webpackChunkName: "pages/forms/elements" */))
const _2b17a012 = () => interopDefault(import('..\\pages\\forms\\validation.vue' /* webpackChunkName: "pages/forms/validation" */))
const _024c845e = () => interopDefault(import('..\\pages\\maps\\google.vue' /* webpackChunkName: "pages/maps/google" */))
const _5b73abdb = () => interopDefault(import('..\\pages\\maps\\vector.vue' /* webpackChunkName: "pages/maps/vector" */))
const _c90097d8 = () => interopDefault(import('..\\pages\\pages\\timeline.vue' /* webpackChunkName: "pages/pages/timeline" */))
const _9bdde7c4 = () => interopDefault(import('..\\pages\\pages\\user.vue' /* webpackChunkName: "pages/pages/user" */))
const _fc7473d2 = () => interopDefault(import('..\\pages\\tables\\paginated.vue' /* webpackChunkName: "pages/tables/paginated" */))
const _0487d7e6 = () => interopDefault(import('..\\pages\\tables\\regular.vue' /* webpackChunkName: "pages/tables/regular" */))
const _06d9c51e = () => interopDefault(import('..\\pages\\tables\\sortable.vue' /* webpackChunkName: "pages/tables/sortable" */))
const _c9e0c6be = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'active',
  scrollBehavior,

  routes: [{
    path: "/alternative",
    component: _606bf0bc,
    name: "alternative"
  }, {
    path: "/aprobado",
    component: _2e11c7b7,
    name: "aprobado"
  }, {
    path: "/banco",
    component: _53d7180a,
    name: "banco"
  }, {
    path: "/calendar",
    component: _77f6253f,
    name: "calendar"
  }, {
    path: "/charts",
    component: _08767116,
    name: "charts"
  }, {
    path: "/comprobante",
    component: _60b61243,
    name: "comprobante"
  }, {
    path: "/conciliacion",
    component: _7d3c02e2,
    name: "conciliacion"
  }, {
    path: "/dashboard",
    component: _2a828c3a,
    name: "dashboard"
  }, {
    path: "/libro",
    component: _074a815e,
    name: "libro"
  }, {
    path: "/lock",
    component: _25b6cd2c,
    name: "lock"
  }, {
    path: "/pricing",
    component: _615ac7d5,
    name: "pricing"
  }, {
    path: "/recuperar",
    component: _bbc337d0,
    name: "recuperar"
  }, {
    path: "/register",
    component: _27311e24,
    name: "register"
  }, {
    path: "/revision",
    component: _42724b5c,
    name: "revision"
  }, {
    path: "/usuario",
    component: _358f273d,
    name: "usuario"
  }, {
    path: "/widgets",
    component: _62fb0b84,
    name: "widgets"
  }, {
    path: "/components/buttons",
    component: _2bfa0cba,
    name: "components-buttons"
  }, {
    path: "/components/cards",
    component: _94f47048,
    name: "components-cards"
  }, {
    path: "/components/grid-system",
    component: _0a7778cf,
    name: "components-grid-system"
  }, {
    path: "/components/icons",
    component: _71408013,
    name: "components-icons"
  }, {
    path: "/components/notifications",
    component: _6bd639e1,
    name: "components-notifications"
  }, {
    path: "/components/typography",
    component: _207ed586,
    name: "components-typography"
  }, {
    path: "/forms/components",
    component: _4dd8d414,
    name: "forms-components"
  }, {
    path: "/forms/elements",
    component: _5e245af5,
    name: "forms-elements"
  }, {
    path: "/forms/validation",
    component: _2b17a012,
    name: "forms-validation"
  }, {
    path: "/maps/google",
    component: _024c845e,
    name: "maps-google"
  }, {
    path: "/maps/vector",
    component: _5b73abdb,
    name: "maps-vector"
  }, {
    path: "/pages/timeline",
    component: _c90097d8,
    name: "pages-timeline"
  }, {
    path: "/pages/user",
    component: _9bdde7c4,
    name: "pages-user"
  }, {
    path: "/tables/paginated",
    component: _fc7473d2,
    name: "tables-paginated"
  }, {
    path: "/tables/regular",
    component: _0487d7e6,
    name: "tables-regular"
  }, {
    path: "/tables/sortable",
    component: _06d9c51e,
    name: "tables-sortable"
  }, {
    path: "/",
    component: _c9e0c6be,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
