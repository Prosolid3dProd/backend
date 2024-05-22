const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);

let Schema = mongoose.Schema;

let reporthomSchema = new Schema(
  {
    orderCode: { type: String },
    customerName: { type: String },
    phone: { type: String },
    location: { type: String },
    cabinets: [{ type: Object }],
    details: [{ type: Object }],
    color: { type: String },
    drawer: { type: String },
    handle: { type: String },
    cabinet: { type: String },
    observation: { type: String },
    coefficient: { type: String },
    modelDoor: { type: String },
    modelHandler: { type: String },
    materialDoor: { type: String },
    modelCabinet: { type: String },
    materialCabinet: { type: String },
    modelDrawer: { type: String },
    materialDrawer: { type: String },
    total: { type: String },
    archived: { type: Date, default: null },
    fecha: { type: String },
    discountEncimeras: { type: String },
    discountCabinets: { type: String },
    discountElectrodomesticos: { type: String },
    discountEquipamientos: { type: String },
    projectName: { type: String },
    zocalo: { type: String },
    fechaEntrega: { type: String },
    semanaEntrega: { type: String },
    drawersArray: { type: Array },
    extra: { type: Object },
    storeName: { type: String },
    designerName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "ReporthomUser" },
    infoZocalos: [{ type: Object }],
    infoTiradores: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

// pedro

reporthomSchema.plugin(uniqueValidator, { master: "{PATH} debe ser unico" });
reporthomSchema.methods.toJSON = function () {
  let data = this;
  let instanceObject = data.toObject();
  return instanceObject;
};

module.exports = mongoose.model("Reporthom", reporthomSchema);
