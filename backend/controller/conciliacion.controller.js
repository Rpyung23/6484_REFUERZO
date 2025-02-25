const ConciliacionModel = require('../model/conciliacion.model')
class ConciliacionController {
    static async readConciliacionController(cuenta){
        return await ConciliacionModel.readConciliacionModel(cuenta)
    }

    static async aprobar_revisionConciliacionController(id_conciliacion,estado){
        return await ConciliacionModel.aprobar_revisionConciliacionModel(id_conciliacion,estado)
    }

    static async actualizarDetalleConciliacionController(id_contable,id_conciliacion,id_transaccion){
       return await ConciliacionModel.actualizarDetalleConciliacionModel(id_contable,id_conciliacion,id_transaccion)
    }

    static async readDetalleConcoliacionController(id_conciliacion){
        return await ConciliacionModel.readDetalleConcoliacionModel(id_conciliacion)
    }

    static async createConciliacionController(id_cuenta,name_conciliacion, usuario,fechaI,fechaF){
        return await ConciliacionModel.createConciliacionModel(id_cuenta,name_conciliacion, usuario,fechaI,fechaF)
    }
    static async deleteConciliacionController(id_conciliacion){
        return await ConciliacionModel.deleteConciliacionModel(id_conciliacion)
    }
}

module.exports = ConciliacionController