const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);
// importar bcrypt
const bcrypt = require("bcrypt");

let Schema = mongoose.Schema;

let reporthomUserSchema = new Schema(
  {
    name: { type: String },
    code: { type: Number },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    genre: { type: String },
    observacion1: { type: String },
    observacion2: { type: String },
    observacion3: { type: String },
    observacion4: { type: String },
    observacion5: { type: String },
    subtitle: { type: String },
    logo: { type: String },
    location: { type: String },
    image: { type: String },
    observation: { type: String },
    active: { type: Boolean },
    archived: { type: Date },
    extra: { type: Object },
    coefficient: { type: String },
    iva: { type: String },
    role: {
      type: String,
      enum: {
        values: ["admin", "client"],
        message: "{VALUE} no es un role válido",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

reporthomUserSchema.index({ name: "text", email: "text" });
reporthomUserSchema.plugin(uniqueValidator, {
  message: "{PATH} debe ser unico",
});

reporthomUserSchema.methods.toJSON = function () {
  let data = this;
  let instanceObject = data.toObject();
  return instanceObject;
};

module.exports = mongoose.model("ReporthomUser", reporthomUserSchema);
