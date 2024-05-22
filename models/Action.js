const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);

let Schema = mongoose.Schema;

let actionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    type: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

actionSchema.index({ message: "text", title: "text" });
actionSchema.plugin(uniqueValidator, { message: "{PATH} debe ser unico" });

actionSchema.methods.toJSON = function () {
  let data = this;
  let instanceObject = data.toObject();
  return instanceObject;
};

module.exports = mongoose.model("Action", actionSchema);
