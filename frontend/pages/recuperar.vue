<template>
  <div>
    <!-- Header -->
    <div class="header py-lg-7"></div>
    <!-- Page content -->
    <div class="container mt--9">
      <!-- Table -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card bg-secondary border-0">
            <div class="text-center text-muted mb-4">
              <img
                srcset="/img/logo_dashboard.jpeg"
                style="margin-top: 1rem"
                height="200"
                width="200"
              />
            </div>
            <div class="card-body">
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="Ingrese su usuario"
                    name="Ingrese su usuario"
                    :rules="{ required: true,email:true }"
                    v-model="email_cliente"
                  >
                  </base-input>

                  <div class="row my-4">
                    <div class="col-12">
                      <base-input
                        :rules="{ required: { allowFalse: false } }"
                        name="Política de Privacidad"
                        Policy
                      >
                        <base-checkbox v-model="agree_cliente">
                          <span class="text-muted"
                            >Estoy de acuerdo con el
                            <a href="#!">Política de Privacidad</a></span
                          >
                        </base-checkbox>
                      </base-input>
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4">
                      Recuperar Contraseña
                    </button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";


export default {
  layout: "AuthLayout",
  name: "register",
  data() {
    return {
      email_cliente: null,
      agree_cliente: false,
    };
  },
  methods: {
    clearForm() {
      this.email_cliente = null;
    },
    async onSubmit() {
      try {

        var response_email = await this.$axios.get(
          process.env.baseUrl + "/isExistEmail/" + this.email_cliente
        );

        if (response_email.data.status_code != 200) 
        {
          this.$notify({
              type: "danger",
              message:
                "Lo sentimos no hemos encontrado su correo electronico",
            })
        } else {
          var response = await this.$axios.post(
            process.env.baseUrl + "/recovery_pass",
            {
              email: this.email_cliente,
            }
          );

          //console.log(response)

          if (response.status == 200) {
            this.$notify({
              type: "default",
              message:
                "Hemos enviado una contraseña temporal a su correo electrónico. Por favor, revise su bandeja de entrada para continuar con el acceso.",
            });

            this.$router.push("/");
          }
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          type: "danger",
          message: error.toString(),
        });
      }
    },
  },
};
</script>
<style></style>
