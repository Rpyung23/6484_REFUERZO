<template>
  <div>
    <!-- Page content -->
    <div class="container" style="padding-top: 7rem">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <div class="card-header bg-transparent">
              <div class="text-muted text-center">
                <strong><h3>Bienvenido a CB</h3></strong>
              </div>
            </div>
            <div class="card-body px-lg-5 py-lg-5">
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Cédula de identidad"
                    :rules="{ required: true, email: false }"
                    prepend-icon="ni ni-email-83"
                    placeholder="Cédula de identidad"
                    v-model="model.email"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Contraseña"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Contraseña"
                    v-model="model.password"
                  >
                  </base-input>

                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >Ingreso</base-button
                    >
                  </div>
                </form>
              </validation-observer>

              <div class="row mt-3">
                <div class="col-6">
                  <router-link to="/recuperar" class="text-default"
                    ><small>Recuperar contraseña?</small></router-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "AuthLayout",
  data() {
    return {
      model: {
        email: "",
        password: "",
        rememberMe: false,
      },
    };
  },
  methods: {
    async onSubmit() {
      try {
        var response = await this.$axios.post(process.env.baseUrl + "/login", {
          user: this.model.email,
          pass: this.model.password,
        });

        if (response.data.status_code == 200) {
          this.$cookies.set("tokenCB", response.data.token);
          this.$cookies.set("estado_user_CB",response.data.estado);
          this.$cookies.set("rol_user_CB",response.data.rol);
          this.$router.push("/dashboard");
        } else {
          this.$notify({
            message: "Lo sentimos sus credenciales no han sido encontradas",
            timeout: 3000,
            icon: "ni ni-fat-remove",
            type: "danger",
          });
        }
      } catch (error) {
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }
    },
  },
};
</script>
