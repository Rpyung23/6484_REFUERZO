<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot-scope="props" slot="links">
        <!--<sidebar-item
          :link="{
            name: 'Dashboards',
            icon: 'ni ni-shop text-primary',
          }"
        >
          <sidebar-item
            :link="{ name: 'Dashboard', path: '/dashboard' }"
          ></sidebar-item>
          <sidebar-item
            :link="{ name: 'Alternative', path: '/alternative' }"
          ></sidebar-item>
        </sidebar-item> -->

        <sidebar-item
          v-if="oRol == 1 || oRol == 4"
          :link="{
            name: 'Usuarios',
            icon: 'ni ni-single-02 text-green',
            path: '/usuario',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 3 || oRol == 4"
          :link="{
            name: 'Cuentas Bancarias',
            icon: 'ni ni-building text-orange',
            path: '/banco',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 2"
          :link="{
            name: 'Recibos Bancarios',
            icon: 'ni ni-single-copy-04 text-info',
            path: '/comprobante',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 2"
          :link="{
            name: 'Libro Contable',
            icon: 'ni ni-collection text-dark',
            path: '/libro',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 2"
          :link="{
            name: 'Conciliación',
            icon: 'ni ni-curved-next text-danger',
            path: '/conciliacion',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 3"
          :link="{
            name: 'C. Revisión',
            icon: 'ni ni-collection text-success',
            path: '/revision',
          }"
        >
        </sidebar-item>

        <sidebar-item
          v-if="oRol == 1 || oRol == 4"
          :link="{
            name: 'C. Aprobados',
            icon: 'ni ni-check-bold text-primary',
            path: '/aprobado',
          }"
        >
        </sidebar-item>

        <!--<sidebar-item :link="{
                  name: 'Examples',
                  icon: 'ni ni-ungroup text-orange'
                  }">
          <sidebar-item :link="{ name: 'Pricing', path: '/pricing' }"/>
          <sidebar-item :link="{ name: 'Login', path: '/login' }"/>
          <sidebar-item :link="{ name: 'Register', path: '/register' }"/>
          <sidebar-item :link="{ name: 'Lock', path: '/lock' }"/>
          <sidebar-item :link="{ name: 'Timeline', path: '/pages/timeline' }"/>
          <sidebar-item :link="{ name: 'Profile', path: '/pages/user' }"/>


        </sidebar-item>

        <sidebar-item :link="{
                  name: 'Components',
                  icon: 'ni ni-ui-04 text-info'
                }">
          <sidebar-item :link="{ name: 'Buttons', path: '/components/buttons' }"/>
          <sidebar-item :link="{ name: 'Cards', path: '/components/cards' }"/>
          <sidebar-item :link="{ name: 'Grid', path: '/components/grid-system' }"/>
          <sidebar-item :link="{ name: 'Notifications', path: '/components/notifications' }"/>
          <sidebar-item :link="{ name: 'Icons', path: '/components/icons' }"/>
          <sidebar-item :link="{ name: 'Typography', path: '/components/typography' }"/>

          <sidebar-item :link="{ name: 'Multi Level' }">
            <sidebar-item :link="{ name: 'Third level menu', path:'#' }"/>
            <sidebar-item :link="{ name: 'Just another link', path:'#' }"/>
            <sidebar-item :link="{ name: 'One last link', path:'#' }"/>
          </sidebar-item>
        </sidebar-item>
        <sidebar-item :link="{
                        name: 'Forms',
                        icon: 'ni ni-single-copy-04 text-pink'
                      }">
          <sidebar-item :link="{ name: 'Elements', path: '/forms/elements' }"/>
          <sidebar-item :link="{ name: 'Components', path: '/forms/components' }"/>
          <sidebar-item :link="{ name: 'Validation', path: '/forms/validation' }"/>
        </sidebar-item>

        <sidebar-item :link="{
                        name: 'Tables',
                        icon: 'ni ni-align-left-2 text-default'
                      }">
          <sidebar-item :link="{ name: 'Tables', path: '/tables/regular' }"/>
          <sidebar-item :link="{ name: 'Sortable', path: '/tables/sortable' }"/>
          <sidebar-item :link="{ name: 'Paginated Tables', path: '/tables/paginated' }"/>
        </sidebar-item>

        <sidebar-item :link="{
                        name: 'Maps',
                        icon: 'ni ni-map-big text-primary'
                      }">
          <sidebar-item :link="{ name: 'Google', path: '/maps/google' }"/>
          <sidebar-item :link="{ name: 'Vector', path: '/maps/vector' }"/>
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Widgets',
            icon: 'ni ni-archive-2 text-green',
            path: '/widgets'
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Charts',
            icon: 'ni ni-chart-pie-35 text-info',
            path: '/charts'
          }">
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Calendar',
            icon: 'ni ni-calendar-grid-58 text-red',
            path: '/calendar'
          }">
        </sidebar-item> -->
      </template>

      <!--<template slot="links-after">
        <hr class="my-3">
        <h6 class="navbar-heading p-0 text-muted">Documentation</h6>

        <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <a class="nav-link" href="https://demos.creative-tim.com/nuxt-argon-dashboard-pro/documentation"
               target="_blank" rel="noopener">
              <i class="ni ni-spaceship"></i>
              <span class="nav-link-text">Getting started</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link"
               href="https://demos.creative-tim.com/nuxt-argon-dashboard-pro/documentation/foundation/colors.html"
               target="_blank" rel="noopener">
              <i class="ni ni-palette"></i>
              <span class="nav-link-text">Foundation</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link"
               href="https://demos.creative-tim.com/nuxt-argon-dashboard-pro/documentation/components/avatars.html"
               target="_blank" rel="noopener">
              <i class="ni ni-ui-04"></i>
              <span class="nav-link-text">Components</span>
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link"
               href="https://demos.creative-tim.com/nuxt-argon-dashboard-pro/documentation/components/plugin_datepicker.html"
               target="_blank" rel="noopener">
              <i class="ni ni-chart-pie-35"></i>
              <span class="nav-link-text">Plugins</span>
            </a>
          </li>
        </ul>
      </template> -->
    </side-bar>
    <div class="main-content">
      <dashboard-navbar
        :type="$route.name === 'alternative' ? 'light' : 'default'"
      ></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <nuxt></nuxt>
      </div>
    </div>

    <modal
      :show.sync="isModalPass"
      modal-classes="static modal-dialog-centered modal-sm"
      :banderaCloseMouseClickAfuera="false"
    >
      <h5 slot="header" class="modal-title" id="modal-title-default">
        Actualizar Contraseña
      </h5>
      <div>
        <base-input
          label="Nueva Contraseña"
          placeholder="Nueva Contraseña"
          name="Nueva Contraseña"
          required
          minlength="6"
          v-model="nueva_pass"
          input-classes="form-control-alternative new-event--title"
        >
        </base-input>
        <base-input
          label="Repetir Contraseña"
          placeholder="Repetir Contraseña"
          name="Repetir Contraseña"
          required
          minlength="6"
          v-model="repet_pass"
          input-classes="form-control-alternative new-event--title"
        >
        </base-input>
      </div>

      <template slot="footer">
        <base-button @click="updatePass()" type="primary" class="new-event--add"
          >Actualizar Contraseña</base-button
        >
      </template>
    </modal>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "~/components/layouts/argon/DashboardNavbar.vue";
import ContentFooter from "~/components/layouts/argon/ContentFooter.vue";
import DashboardContent from "~/components/layouts/argon/Content.vue";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
  },
  data() {
    return {
      oRol: null,
      isModalPass: false,
      nueva_pass: null,
      repet_pass: null,
      token: this.$cookies.get("tokenCB"),
    };
  },
  methods: {
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("navbar-inner");
        initScrollbar("main-content");
        initScrollbar("sidenav");
      }
    },
    async updatePass() {
      try {
        if (this.nueva_pass != this.repet_pass) {
          //alert("ssa")
          
          this.$notify({
            title: "ERROR CONTRASEÑA",
            message: "Lo sentimos su contraseña no coincide",
            type: "danger",
          });
          return;
        }

        var response = await this.$axios.put(
          process.env.baseUrl + "/update_pass",
          {
            token: this.token,
            contrasenia: this.nueva_pass,
          }
        )

        if (response.data.status_code == 200) {
          this.$cookies.remove("estado_user_gipac");
          this.isModalPass = false;
          this.$notify({
            title: "NUEVA CONTRASEÑA",
            message: "CONTRASEÑA ACTUALIZADA CON EXITO",
            type: "success",
          });
        } else {
          this.$notify({
            title: "NUEVA CONTRASEÑA",
            message: response.data.msm,
            type: "danger",
          });
        }
      } catch (error) {
        console.log(error)
        this.$notify({
          title: "ERROR CONTRASEÑA",
          message: error.toString(),
          type: "danger",
        });
      }
    },
  },
  mounted() {
    this.initScrollbar();
    var token = this.$cookies.get("tokenCB");
    var estado = this.$cookies.get("estado_user_CB");
    if (estado == 2) {
      this.isModalPass = true;
    }
    this.oRol = this.$cookies.get("rol_user_CB");
  },
};
</script>
<style lang="scss"></style>
