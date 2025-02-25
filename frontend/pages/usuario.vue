<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7"></div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" @click="showModalAddUsuario()" type="neutral"
            >Nuevo usuario</base-button
          >
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div>
        <card
          class="no-border-card"
          body-classes="px-0 pb-1"
          footer-classes="pb-2"
        >
          <div>
            <div
              class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
            >
              <el-select
                class="select-primary pagination-select"
                v-model="pagination.perPage"
                placeholder="Per page"
              >
                <el-option
                  class="select-primary"
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>

              <div>
                <base-input
                  v-model="searchQuery"
                  prepend-icon="fas fa-search"
                  placeholder="Busqueda..."
                >
                </base-input>
              </div>
            </div>
            <el-table
              :data="queriedData"
              row-key="id"
              header-row-class-name="thead-light"
            >
              <el-table-column min-width="150" align="right" label="Actions">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <!--<base-button
                    @click.native="handleEdit($index, row)"
                    class="edit"
                    type="default"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button> -->
                  <base-button
                    @click.native="handleDelete($index, row)"
                    class="remove btn-link"
                    type="danger"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-fat-remove"></i>
                  </base-button>
                </div>
              </el-table-column>

              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                v-bind="column"
              >
              </el-table-column>

              <el-table-column min-width="150" align="right" label="estado">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <Badge>{{ row.estado == 1 ? "Activo" : "Inactivo" }}</Badge>
                </div>
              </el-table-column>
            </el-table>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category">
                Mostrando {{ from + 1 }} a {{ to }} de {{ total }} entradas

                <span v-if="selectedRows.length">
                  &nbsp; &nbsp; {{ selectedRows.length }} rows selected
                </span>
              </p>
            </div>
            <base-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            >
            </base-pagination>
          </div>
        </card>
      </div>
    </div>

    <modal :show.sync="ModalUsuario" size="sm" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes=""
        class="border-0 mb-0"
      >
        <template slot="header">
          <div class="text-muted text-center">
            <strong>Nueva usuario</strong>
          </div>
        </template>

        <template>
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form role="form" @submit.prevent="handleSubmit(onSubmitUsuario)">
              <base-input
                class="mb-3"
                v-model="userUsuario"
                rules="required"
                name="Usuario"
                placeholder="Usuario"
                prepend-icon="ni ni-circle-08"
              >
              </base-input>
              <base-input
                class="mb-3"
                type="password"
                v-model="passUsuario"
                rules="required"
                name="Contraseña"
                min="8"
                placeholder="Contraseña"
                prepend-icon="ni ni-key-25"
              >
              </base-input>
              <base-input
                type="text"
                v-model="nameUsuario"
                name="Nombres Completos"
                rules="required"
                placeholder="Nombres Completos"
                prepend-icon="ni ni-badge"
              >
              </base-input>
              <base-input
                type="email"
                v-model="emailUsuario"
                name="Correo Electronico"
                :rules="{ required: true, email: true }"
                placeholder="Correo Electronico"
                prepend-icon="ni ni-email-83"
              >
              </base-input>
              <div class="row">
                <div class="col-12">
                  <base-input name="T. Rol" rules="required">
                    <el-select
                      filterable
                      v-model="mSelectRol"
                      placeholder="T. Rol"
                    >
                      <el-option
                        v-for="option in selectOptions"
                        :key="option.id_rol"
                        :label="option.detalle"
                        :value="option.id_rol"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
              </div>
              <div class="text-center">
                <base-button type="primary" native-type="submit" class="my-4"
                  >Guardar cuenta</base-button
                >
              </div>
            </form>
          </validation-observer>
        </template>
      </card>
    </modal>
  </div>
</template>
<script>
import Badge from "@/components/argon-core/Badge";
import { Table, TableColumn, Select, Option } from "element-ui";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import clientPaginationMixin from "~/components/tables/PaginatedTables/clientPaginationMixin";
import swal from "sweetalert2";
import { validarNumeroCelular } from "~/util/validaciones.js";

export default {
  mixins: [clientPaginationMixin],
  layout: "DashboardLayout",
  components: {
    BasePagination,
    RouteBreadCrumb,
    Badge,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      tableColumns: [
        {
          prop: "id_usuario",
          label: "Usuario",
          minWidth: 160,
        },
        {
          prop: "nombre",
          label: "Nombres Completos",
          minWidth: 250,
        },
        {
          prop: "cel",
          label: "Email",
          minWidth: 240,
        },
        {
          prop: "detalle",
          label: "Rol",
          minWidth: 170,
        },
      ],
      tableData: [],
      selectedRows: [],
      selectOptions: [],

      ModalUsuario: false,
      userUsuario: null,
      passUsuario: null,
      nameUsuario: null,
      emailUsuario: null,
      mSelectRol: null,
    };
  },
  methods: {
    clearModalAddUsuario() {
      this.ModalUsuario = false;
      this.userUsuario = null;
      this.passUsuario = null;
      this.nameUsuario = null;
      this.emailUsuario = null;
      this.mSelectRol = null;
    },
    showModalAddUsuario() {
      this.ModalUsuario = true;
    },
    async handleDelete(index, row) {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/deleteUsuario",{
            usuario: row.id_usuario
          }
        );
        if (response.data.status_code == 200) {
          this.$notify({
            message: "Usuario eliminado con exíto",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
          this.apiReadUsuarios()
        } else {
          this.$notify({
            message: "Lo sentimos no hemos podido eliminar su usuario",
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
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    async apiReadUsuarios() {
      this.tableData = [];
      try {
        var response = await this.$axios.get(
          process.env.baseUrl + "/usuarios",
          {
            headers: {
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );

        this.tableData.push(...response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async apiReadRol() {
      try {
        var response = await this.$axios.get(process.env.baseUrl + "/rol");
        this.selectOptions.push(...response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmitUsuario() {
      try {
        if (this.mSelectRol == null || this.mSelectRol == "") {
          this.$notify({
            message: "Por favor, seleccione su rol",
            timeout: 3000,
            icon: "ni ni-fat-remove",
            type: "danger",
          });
          return;
        }

        var response = await this.$axios.post(
          process.env.baseUrl + "/createUsuario",
          {
            usuario: this.userUsuario,
            nombre: this.nameUsuario,
            id_rol: this.mSelectRol,
            pass: this.passUsuario,
            cel: this.emailUsuario,
          }
        );

        if (response.data.status_code == 200) {
          this.$notify({
            message: "Usuario creado con exíto",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
          this.clearModalAddUsuario();
          this.apiReadUsuarios();
        } else {
          this.$notify({
            message: "Lo sentimos no hemos podido crear su usuario",
            timeout: 3000,
            icon: "ni ni-fat-remove",
            type: "danger",
          });
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }
    },
  },
  mounted() {
    this.apiReadRol();
    this.apiReadUsuarios();
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
