<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <el-select
            v-model="mSelectCuenta"
            filterable
            collapse-tags
            style="width: 20rem"
            clearable
            placeholder="Cuentas Bancarias"
          >
            <el-option
              v-for="option in selectOptionsCuentas"
              :key="option.id_cuenta"
              :label="option.id_cuenta + ' (' + option.banco + ')'"
              :value="option.id_cuenta"
            >
            </el-option>
          </el-select>
        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" @click="showModalConciliacion()" type="neutral"
            >Nueva conciliacion</base-button
          >
          <base-button
            size="sm"
            @click="apiReadListConciliacion()"
            type="default"
            >Buscar</base-button
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
              <el-table-column min-width="200" align="center" label="Actions">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <base-button
                    @click.native="updateRevicionConciliacion($index, row)"
                    class="success"
                    v-if="row.estado_c == 1"
                    type="success"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-check-bold"></i>
                  </base-button>

                  <base-button
                    v-if="row.estado_c == 1"
                    @click.native="showModalDetalleConciliacion($index, row)"
                    class="edit"
                    type="default"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button>
                  <base-button
                    v-if="row.estado_c == 1"
                    @click.native="deleteConciliacion($index, row)"
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
                  <Badge rounded class="mr-2">{{
                    row.estado_c == 1
                      ? "En Proceso"
                      : row.estado_c == 2
                      ? "En Revision"
                      : "Aprobado"
                  }}</Badge>
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

    <modal :show.sync="ModalConciliacion" size="sm" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes=""
        class="border-0 mb-0"
      >
        <template slot="header">
          <div class="text-muted text-center">
            <strong>Nueva conciliación</strong>
          </div>
        </template>

        <template>
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form
              role="form"
              @submit.prevent="handleSubmit(onSubmitConciliacion)"
            >
              <div class="row">
                <div class="col-12">
                  <el-select
                    v-model="mSelectCuentaConciliacion"
                    filterable
                    :required="true"
                    required
                    collapse-tags
                    style="width: 100%; margin-bottom: 1rem"
                    clearable
                    placeholder="Cuentas Bancarias"
                  >
                    <el-option
                      v-for="option in selectOptionsCuentas"
                      :key="option.id_cuenta"
                      :label="option.id_cuenta + ' (' + option.banco + ')'"
                      :value="option.id_cuenta"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>

              <div class="row">
                <div class="col-6">
                  <base-input label="">
                    <flat-picker
                      slot-scope="{ focus, blur }"
                      @on-open="focus"
                      @on-close="blur"
                      v-model="fechaINuevoConsolidado"
                      :config="config_flatpicker"
                      class="form-control datepicker"
                    >
                    </flat-picker>
                  </base-input>
                </div>
                <div class="col-6">
                  <base-input label="">
                    <flat-picker
                      slot-scope="{ focus, blur }"
                      @on-open="focus"
                      @on-close="blur"
                      v-model="fechaFNuevoConsolidado"
                      :config="config_flatpicker"
                      class="form-control datepicker"
                    >
                    </flat-picker>
                  </base-input>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <base-input
                    type="text"
                    name="Detalle conciliacion"
                    rules="required"
                    v-model="nameConciliacion"
                    placeholder="Detalle conciliacion"
                  >
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

    <modal :show.sync="ModalDetalleConciliacion" size="xl" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes=""
        class="border-0 mb-0"
      >
        <template slot="header">
          <div class="text-muted text-center">
            <strong>Detalle conciliación</strong>
          </div>
        </template>

        <el-table
          :data="mListaDetalleConciliacion"
          row-key="id"
          header-row-class-name="thead-light"
        >
          <el-table-column min-width="150" align="right" label="Actions">
            <div slot-scope="{ $index, row }" class="d-flex">
              <base-button
                @click.native="showModalCruzarConciliacion($index, row)"
                class="remove btn-link"
                type="primary"
                size="sm"
                icon
              >
                <i class="text-white ni ni-curved-next"></i>
              </base-button>
            </div>
          </el-table-column>

          <el-table-column
            v-for="column in tableColumnsDetalle"
            :key="column.label"
            v-bind="column"
          >
          </el-table-column>
        </el-table>
      </card>
    </modal>

    <modal :show.sync="ModalCruzarConciliacion" size="sm" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes=""
        class="border-0 mb-0"
      >
        <template slot="header">
          <div class="text-muted text-center">
            <strong
              >Registro Contable N°
              {{
                objComprobanteConciliacion == null
                  ? ""
                  : objComprobanteConciliacion.fk_registros_contables
              }}</strong
            >
          </div>
        </template>

        <div class="row">
          <div class="col-12">
            <el-select
              filterable
              v-model="mSelectComprobanteConciliacion"
              style="width: 100%"
              placeholder="N° Comprobante"
            >
              <el-option
                v-for="option in mListComprobanteBancarioConciliacion"
                :key="option.id_transaccion"
                :label="
                  option.id_transaccion +
                  ' ($' +
                  option.monto +
                  ')' +
                  ' (' +
                  option.fecha +
                  ')'
                "
                :value="option.id_transaccion"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-right">
            <base-button
              type="primary"
              @click="apiUpdateDetalleConciliacion()"
              size="sm"
              class="my-4"
              >Guardar cuenta</base-button
            >
          </div>
        </div>
      </card>
    </modal>
  </div>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Badge from "@/components/argon-core/Badge";
import { Table, TableColumn, Select, Option } from "element-ui";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import conciliacionPaginationMixin from "~/components/tables/PaginatedTables/conciliacionPaginationMixin";
import swal from "sweetalert2";
import { getFechaActual } from "../util/fechas";

export default {
  mixins: [conciliacionPaginationMixin],
  layout: "DashboardLayout",
  components: {
    BasePagination,
    RouteBreadCrumb,
    Badge,
    flatPicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      config_flatpicker: {
        allowInput: true,
        locale: Spanish,
        mode: "single",
      },
      selectOptionsCuentas: [],
      tableColumns: [
        {
          prop: "fk_id_cuenta",
          label: "N° Cuenta",
          minWidth: 160,
        },
        {
          prop: "name_conciliacion",
          label: "Detalle C.",
          minWidth: 180,
        },
        {
          prop: "rangoFecha",
          label: "Rango Fecha",
          minWidth: 240,
        },
        {
          prop: "saldo_banco",
          label: "Saldo Banco",
          minWidth: 180,
        },
        {
          prop: "saldo_contable",
          label: "Saldo Contable",
          minWidth: 180,
        },
        {
          prop: "diferencia",
          label: "Diferencia",
          minWidth: 180,
        },
      ],
      tableColumnsDetalle: [
        {
          prop: "fk_registros_contables",
          label: "R. Contable",
          minWidth: 160,
        },
        {
          prop: "id_transaccion",
          label: "T. Bancaria",
          minWidth: 180,
        },
        {
          prop: "monto_contable",
          label: "Monto Contable",
          minWidth: 180,
        },
        {
          prop: "monto_bancario",
          label: "Monto Bancario",
          minWidth: 180,
        },
        {
          prop: "monto_discrepante",
          label: "Diferencia",
          minWidth: 180,
        },
        {
          prop: "solucion",
          label: "Solución",
          minWidth: 180,
        },
      ],
      tableData: [],
      selectedRows: [],
      ModalConciliacion: false,
      ModalDetalleConciliacion: false,
      mSelectCuenta: null,
      mSelectCuentaConciliacion: null,
      nameConciliacion: null,
      fechaINuevoConsolidado: null,
      fechaFNuevoConsolidado: null,
      ModalCruzarConciliacion: false,
      mListaDetalleConciliacion: [],
      mListComprobanteBancarioConciliacion: [],
      mSelectComprobanteConciliacion: null,
      objComprobanteConciliacion: null,
    };
  },
  methods: {
    async updateRevicionConciliacion(index, row) {
      try {
        //alert(row.id_conciliaciones)
        var response = await this.$axios.put(
          process.env.baseUrl +
            "/actualizarEstadoConciliacion/" +
            row.id_conciliaciones +
            "/2"
        );
        if (response.data.status_code == 200) {
          this.apiReadListConciliacion();
        } else {
          this.$notify({
            message:
              "Lo sentimos no hemos podido enviar a revision su conciliacion",
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
    showModalCruzarConciliacion(index, row) {
      this.ModalCruzarConciliacion = true;
      this.mSelectComprobanteConciliacion = null;
      this.objComprobanteConciliacion = row;
    },
    showModalConciliacion() {
      this.ModalConciliacion = true;
    },
    async onSubmit() {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/cuenta_bancaria",
          {
            cuenta: this.cuentaBancaria,
            name: this.nameBanco,
            tipo: this.mSelectCuenta,
            saldo: this.saldoCuenta,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );

        if (response.data.status_code == 200) {
          this.ModalCuentaBancaria = false;
          this.apiReadCuentaBancarias();
          this.$notify({
            message: "Cuenta bancaria con éxito",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
        } else {
          this.$notify({
            message:
              "Lo sentimos, no hemos podido crear la nueva cuenta bancaria",
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
    showModalDetalleConciliacion(index, row) {
      this.ModalDetalleConciliacion = true;
      this.apiReadDetalleConciliacion(row);
    },
    handleDelete(index, row) {
      swal
        .fire({
          title: "¿Esta seguro?",
          text: `No podrás revertir este cambio para ${row.nombre}`,
          type: "warning",
          showCancelButton: false,
          confirmButtonClass: "btn btn-success btn-fill",
          cancelButtonClass: "btn btn-danger btn-fill",
          confirmButtonText: "Sí, elimínalo!",
          buttonsStyling: false,
        })
        .then((result) => {
          if (result.value) {
            this.deleteRow(row);
            swal.fire({
              title: "Deleted!",
              text: `You deleted ${row.name}`,
              type: "success",
              confirmButtonClass: "btn btn-success btn-fill",
              buttonsStyling: false,
            });
          }
        });
    },
    async apiReadCuentaBancarias() {
      this.selectOptionsCuentas = [];
      try {
        var response = await this.$axios.get(
          process.env.baseUrl + "/cuenta_bancaria",
          {
            headers: {
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );

        this.selectOptionsCuentas.push(...response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async apiReadListConciliacion() {
      this.tableData = [];
      try {
        
        var response = await this.$axios.get(process.env.baseUrl + "/readConciliacion/"+(this.mSelectCuenta == null || this.mSelectCuenta == '' ? '*' : this.mSelectCuenta),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );
        this.tableData.push(...response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmitConciliacion() {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/createConciliacion",
          {
            id_cuenta: this.cuentaBancaria,
            name_conciliacion: this.nameBanco,
            fechaI: this.fechaINuevoConsolidado,
            fechaF: this.fechaFNuevoConsolidado,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );

        if (response.data.status_code == 200) {
          this.ModalConciliacion = false;
          this.apiReadListConciliacion();
          this.$notify({
            message: "Cuenta bancaria con éxito",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
        } else {
          this.$notify({
            message:
              "Lo sentimos, no hemos podido crear la nueva cuenta bancaria",
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
    async deleteConciliacion(index, row) {
      try {
        console.log(row);
        var response = await this.$axios.delete(
          process.env.baseUrl + "/deleteConciliacion",
          {
            headers: {
              Authorization: this.$cookies.get("tokenCB"), // Token de autorización
            },
            data: {
              id_conciliacion: row.id_conciliaciones,
            },
          }
        );

        if (response.data.status_code == 200) {
          this.apiReadListConciliacion();
          this.$notify({
            message: "Conciliación eliminada con éxito",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
        } else {
          this.$notify({
            message: "Lo sentimos no hemos podido eliminar su conciliación",
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
    async apiReadDetalleConciliacion(row) {
      this.mListaDetalleConciliacion = [];
      try {
        var response = await this.$axios.get(
          process.env.baseUrl +
            "/readConciliacionDetalle/" +
            row.id_conciliaciones
        );
        this.mListaDetalleConciliacion.push(...response.data);
        console.log(response.data);
      } catch (error) {
        this.$notify({
          message: error.toString(),
          timeout: 3000,
          icon: "ni ni-fat-remove",
          type: "danger",
        });
      }
    },
    async apiReadComprobanteBanco() {
      this.mListComprobanteBancarioConciliacion = [];
      try {
        var response = await this.$axios.get(
          process.env.baseUrl + "/transaccion_bancaria/*/*"
        );
        this.mListComprobanteBancarioConciliacion.push(...response.data);
      } catch (error) {}
    },
    async apiUpdateDetalleConciliacion() {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/actualizarDetalleConciliacion",
          {
            id_contable: this.objComprobanteConciliacion.fk_registros_contables,
            id_conciliacion:
              this.objComprobanteConciliacion.id_detalles_conciliacion,
            id_transaccion: this.mSelectComprobanteConciliacion,
          }
        );

        if (response.data.status_code == 200) {
          console.log(
            "********************************************************************"
          );
          console.log(this.objComprobanteConciliacion);
          this.ModalCruzarConciliacion = false;
          this.apiReadDetalleConciliacion({
            id_conciliaciones:
              this.objComprobanteConciliacion.fk_id_conciliacion,
          });
          this.apiReadListConciliacion()
        } else {
          this.$notify({
            message: "Lo sentimos, no hemos podido vincular su comprobante",
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
  mounted() {
    this.apiReadComprobanteBanco();
    this.apiReadCuentaBancarias();
    this.apiReadListConciliacion();
    (this.fechaINuevoConsolidado = getFechaActual()),
      (this.fechaFNuevoConsolidado = getFechaActual());
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
