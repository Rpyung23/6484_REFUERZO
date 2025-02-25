<template>
  <div class="content">
    <base-header class="pb-6 py-4">
      <div class="row align-items-center">
        <div class="col-lg-6 col-5">
          <el-select
            v-model="mSelectCuenta"
            filterable
            collapse-tags
            style="width: 20rem;"
            clearable
            placeholder="Cuentas Bancarias"
          >
            <el-option
              v-for="option in selectOptionsCuentas"
              :key="option.id_cuenta"
              :label="option.id_cuenta +' ('+ option.banco+')'"
              :value="option.id_cuenta"
            >
            </el-option>
          </el-select>

          <!--<base-input label="">
            <flat-picker
              slot-scope="{ focus, blur }"
              @on-open="focus"
              @on-close="blur"
              style="width: 15rem;"
              v-model="rangeDateLibro"
              :config="{ allowInput: true, mode: 'range' }"
              class="form-control datepicker"
            >
            </flat-picker>
          </base-input> -->
        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button
            size="sm"
            @click="showModalAddRegistroLibro()"
            type="neutral"
            >Nueva registro</base-button
          >
          <base-button size="sm" @click="apiReadLibroContable()" type="primary"
            >Buscar</base-button
          >
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6 py-4">
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
              :row-class-name="tableRowClassNameLibroContable"
            >
              <el-table-column min-width="100" align="right" label="">
                <div slot-scope="{ $index, row }" class="d-flex">
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

              <el-table-column min-width="150" align="right" label="Monto">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <strong style="color: black">{{ row.monto }}</strong>
                </div>
              </el-table-column>

              <el-table-column min-width="150" align="right" label="estado">
                <div slot-scope="{ $index, row }" class="d-flex">
                  <Badge
                    :type="row.fk_id_tipo == 2 ? 'danger' : 'primary'"
                    rounded
                    class="mr-2"
                    >{{ row.fk_id_tipo == 2 ? "DEBITO" : "CREDITO" }}</Badge
                  >
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

    <!--Classic modal-->
    <modal :show.sync="showModalAddRegistro">
      <h6 slot="header" class="modal-title">Nuevo registro bancario</h6>

      <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
        <form
          role="form"
          @submit.prevent="handleSubmit(onSubmitNuevoRegistroBancario)"
        >
          <div class="row">
            <div class="col-6">
              <el-select
                v-model="mSelectCuentaNuevoRegistro"
                filterable
                :rules="{ required: true }"
                collapse-tags
                placeholder="Cuentas Bancarias"
              >
                <el-option
                  v-for="option in selectOptionsCuentas"
                  :key="option.id_cuenta"
                  :label="option.id_cuenta"
                  :value="option.id_cuenta"
                >
                </el-option>
              </el-select>
            </div>

            <div class="col-6">
              <base-input>
                <flat-picker
                  slot-scope="{ focus, blur }"
                  @on-open="focus"
                  @on-close="blur"
                  :rules="{ required: true }"
                  v-model="fechaActualNuevoRegistro"
                  :config="config_flatpicker"
                  class="form-control datepicker"
                >
                </flat-picker>
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <el-select
                v-model="mSelectTipoMov"
                name="T. Cargo"
                placeholder="T. Cargo"
              >
                <el-option
                  v-for="option in selectOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                >
                </el-option>
              </el-select>
            </div>

            <div class="col-6">
              <base-input
                type="number"
                class="mb-3"
                v-model="valorRegistro"
                step="0.01"
                min="0"
                :rules="{ required: true }"
                name="Valor $(0.00)"
                placeholder="Valor $(0.00)"
              >
              </base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <textarea
                class="form-control"
                placeholder="Motivo"
                name="Motivo"
                v-model="motivoRegistro"
                :rules="{ required: true }"
                rows="2"
              ></textarea>
            </div>
          </div>
          <div class="row" style="margin-top: 2rem">
            <div class="col-12 text-right">
              <base-button type="primary" native-type="submit" size="sm"
                >Guardar registro</base-button
              >
            </div>
          </div>
        </form>
      </validation-observer>
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
import libroPaginationMixin from "~/components/tables/PaginatedTables/libroPaginationMixin";
import swal from "sweetalert2";
import { getFechaActual } from "../util/fechas";

export default {
  mixins: [libroPaginationMixin],
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
      showModalAddRegistro: false,
      mSelectCuenta: null,
      selectOptionsCuentas: [],
      rangeDateLibro: null,
      selectOptions: [
        {
          label: "CREDITO",
          value: 1,
        },
        {
          label: "DEBITO",
          value: 2,
        },
      ],
      tableColumns: [
        {
          prop: "fk_id_cuenta_bancaria",
          label: "N° Cuenta",
          minWidth: 160,
        },
        {
          prop: "fecha",
          label: "F. Movimiento",
          minWidth: 170,
        },
        {
          prop: "descripcion",
          label: "Motivo",
          minWidth: 180,
        },
      ],
      selectedRows: [],
      mListaRegistroContable: [],
      mSelectCuentaNuevoRegistro: null,
      mSelectTipoMov: null,
      fechaActualNuevoRegistro: null,
      motivoRegistro: null,
      valorRegistro: null,
    };
  },
  methods: {
    tableRowClassNameLibroContable({ row, rowIndex }) {
      if (row.fk_id_tipo == 2) {
        return "warning-row-panelControlProduccion";
      } else {
        return "";
      }
    },
    clearModalAddRegistroLibro() {
      this.mSelectCuentaNuevoRegistro = null;
      this.mSelectTipoMov = null;
      this.fechaActualNuevoRegistro = getFechaActual();
      this.motivoRegistro = null;
      this.valorRegistro = null;
    },
    showModalAddRegistroLibro() {
      this.clearModalAddRegistroLibro();
      this.showModalAddRegistro = true;
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
    async apiReadCuentaBancaria() {
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
    async apiReadLibroContable() {
      this.mListaRegistroContable = [];
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/read_registro_contable",
          {
            cuenta: this.mSelectCuenta == null ? "*" : this.mSelectCuenta,
            fecha: "*",
            fechaF: "*",
            tipo: "*",
          },
          {
            headers: {
              Authorization: `Bearer ${this.$cookies.get("tokenCB")}`,
            },
          }
        );

        this.mListaRegistroContable.push(...response.data);
      } catch (error) {
        console.log(error);
      }
    },
    async onSubmitNuevoRegistroBancario() {
      try {
        var response = await this.$axios.post(
          process.env.baseUrl + "/create_registro_contable",
          {
            token: this.$cookies.get("tokenCB"),
            id_cuenta_bancaria: this.mSelectCuentaNuevoRegistro,
            fecha: this.fechaActualNuevoRegistro,
            descripcion: this.motivoRegistro,
            id_tipo: this.mSelectTipoMov,
            monto: this.valorRegistro,
          }
        );
        if (response.data.status_code == 200) {
          this.clearModalAddRegistroLibro();
          this.apiReadLibroContable();
          this.$notify({
            message: "Registro guardado con éxito",
            timeout: 3000,
            icon: "ni ni-check-bold",
            type: "success",
          });
        } else {
          this.$notify({
            message: "Lo sentimos, no hemos podido guardar su registro",
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
    this.apiReadCuentaBancaria();
    this.apiReadLibroContable();
    this.fechaActualNuevoRegistro = getFechaActual();
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}

.el-table .warning-row-panelControlProduccion {
  background: rgba(255, 0, 0, 0.342) !important;
}
</style>
