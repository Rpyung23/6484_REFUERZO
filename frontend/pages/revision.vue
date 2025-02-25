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
              <el-table-column min-width="170" align="center" label="Actions">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <base-button
                    @click.native="updateRevicionConciliacion($index, row,3)"
                    class="success"
                    type="success"
                    title="APROBAR"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-check-bold"></i>
                  </base-button>


                  <base-button
                    @click.native="showModalDetalleConciliacion($index, row)"
                    class="edit"
                    type="default"
                    title="VER DETALLE"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-single-copy-04"></i>
                  </base-button>

                  <base-button
                    @click.native="updateRevicionConciliacion($index, row,1)"
                    class="danger"
                    type="danger"
                    title="NO APROBAR"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-fat-delete"></i>
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
          height="calc(100vh - 14rem)"
          header-row-class-name="thead-light"
        >
          <el-table-column
            v-for="column in tableColumnsDetalle"
            :key="column.label"
            v-bind="column"
          >
          </el-table-column>
        </el-table>
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
    };
  },
  methods: {
    async updateRevicionConciliacion(index, row,estado) {
      try {
      
        var response = await this.$axios.put(
          process.env.baseUrl +
            "/actualizarEstadoConciliacion/" +
            row.id_conciliaciones +
            "/"+estado
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
    showModalDetalleConciliacion(index, row) {
      this.ModalDetalleConciliacion = true;
      this.apiReadDetalleConciliacion(row);
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
        var response = await this.$axios.get(
          process.env.baseUrl + "/readConciliacion/"+(this.mSelectCuenta == null || this.mSelectCuenta == ''  ? '*' : this.mSelectCuenta),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );
        if (response.data.length > 0) {
          for (let index = 0; index < response.data.length; index++) {
            if (response.data[index].estado_c == 2) {
              this.tableData.push(response.data[index]);
            }
          }
        }
      } catch (error) {
        console.log(error);
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
  },
  mounted() {
    this.apiReadCuentaBancarias();
    this.apiReadListConciliacion();
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
