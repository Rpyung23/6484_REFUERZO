<template>
  <div class="content">
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7"></div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" @click="showModalAddCuenta()" type="neutral"
            >Nueva cuenta bancaria</base-button
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
                  <base-button
                    @click.native="handleEdit($index, row)"
                    class="edit"
                    type="default"
                    size="sm"
                    icon
                  >
                    <i class="text-white ni ni-ruler-pencil"></i>
                  </base-button>
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
                  <Badge rounded  class="mr-2">{{ row.estado == 1 ? "Activo" : "Inactivo" }}</Badge>
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

    <modal :show.sync="ModalCuentaBancaria" size="sm" body-classes="p-0">
      <card
        type="secondary"
        header-classes="bg-transparent pb-5"
        body-classes=""
        class="border-0 mb-0"
      >
        <template slot="header">
          <div class="text-muted text-center">
            <strong>Nueva cuenta bancaria</strong>
          </div>
        </template>

        <template>
          <validation-observer v-slot="{ handleSubmit }" ref="formValidator">
            <form role="form" @submit.prevent="handleSubmit(onSubmit)">
              <base-input
                alternative
                class="mb-3"
                v-model="cuentaBancaria"
                rules="required"
                name="Cuenta Bancaria"
                placeholder="Cuenta bancaria"
                prepend-icon="ni ni-credit-card"
              >
              </base-input>
              <base-input
                alternative
                type="text"
                v-model="nameBanco"
                name="Entidad Bancaria"
                rules="required"
                placeholder="Entidad Bancaria"
                prepend-icon="ni ni-building"
              >
              </base-input>
              <div class="row">
                <div class="col-6">
                  <base-input name="T. Cuenta" rules="required">
                    <el-select
                      filterable
                      v-model="mSelectCuenta"
                      placeholder="T. Cuenta"
                    >
                      <el-option
                        v-for="option in selectOptions"
                        :key="option.label"
                        :label="option.label"
                        :value="option.value"
                      >
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="col-6">
                  <base-input
                    alternative
                    type="number"
                    step="0.01"
                    name="Saldo Inicial"
                    rules="required"
                    v-model="saldoCuenta"
                    placeholder="Saldo Inicial"
                    prepend-icon="ni ni-money-coins"
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
  </div>
</template>
<script>
import Badge from "@/components/argon-core/Badge";
import { Table, TableColumn, Select, Option } from "element-ui";
import RouteBreadCrumb from "@/components/argon-core/Breadcrumb/RouteBreadcrumb";
import { BasePagination } from "@/components/argon-core";
import cuentaPaginationMixin from "~/components/tables/PaginatedTables/cuentaPaginationMixin";
import swal from "sweetalert2";

export default {
  mixins: [cuentaPaginationMixin],
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
      selectOptions: [
        {
          label: "AHORROS",
          value: 1,
        },
        {
          label: "CORRIENTE",
          value: 2,
        },
      ],
      ModalCuentaBancaria: false,
      tableColumns: [
        {
          prop: "id_cuenta",
          label: "N° Cuenta",
          minWidth: 160,
        },
        {
          prop: "banco",
          label: "Entidad Bancaria",
          minWidth: 250,
        },
        {
          prop: "detalle_tipo_cuenta",
          label: "T. Cuenta",
          minWidth: 180,
        },
        {
          prop: "saldo_inicial",
          label: "Saldo Actual",
          minWidth: 180,
        },
      ],
      tableData: [],
      selectedRows: [],
      cuentaBancaria: null,
      nameBanco: null,
      mSelectCuenta: null,
      saldoCuenta: null,
    };
  },
  methods: {
    showModalAddCuenta() {
      this.cuentaBancaria = null;
      this.nameBanco = null;
      this.mSelectCuenta = null;
      this.saldoCuenta = null;
      this.ModalCuentaBancaria = true;
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
    handleLike(index, row) {
      swal.fire({
        title: `You liked ${row.name}`,
        buttonsStyling: false,
        type: "success",
        confirmButtonClass: "btn btn-success btn-fill",
      });
    },
    handleEdit(index, row) {
      swal.fire({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-info btn-fill",
      });
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
            /*swal.fire({
              title: "Deleted!",
              text: `You deleted ${row.name}`,
              type: "success",
              confirmButtonClass: "btn btn-success btn-fill",
              buttonsStyling: false,
            });*/
          }
        });
    },
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex(
        (tableRow) => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
    async apiReadCuentaBancarias() {
      this.tableData = [];
      try {
        var response = await this.$axios.get(
          process.env.baseUrl + "/cuenta_bancaria",
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
  },
  mounted() {
    this.apiReadCuentaBancarias();
  },
};
</script>
<style>
.no-border-card .card-footer {
  border-top: 0;
}
</style>
