const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);

let Schema = mongoose.Schema;

let reporthomComplementsSchema = new Schema(
  {
    name: { type: String },
    code: { type: String },
    price: { type: String },
    width: { type: String },
    depth: { type: String },
    height: { type: String },
    archived: { type: Date, default: null },
    type: { type: String },
  },
  {
    timestamps: true,
  }
);

reporthomComplementsSchema.plugin(uniqueValidator, {
  master: "{PATH} debe ser unico",
});

reporthomComplementsSchema.methods.toJSON = function () {
  let data = this;
  let instanceObject = data.toObject();
  return instanceObject;
};

module.exports = mongoose.model(
  "ReporthomComplementsSchema",
  reporthomComplementsSchema
);
