const mongoose = require("mongoose");
const Action = require("../models/Action");
const axios = require("axios");
const fetch = require("node-fetch");

const {
  syncActionsAirtable,
} = require("../controllers/AirTableActionsController");
/**
 * 0 = disconnected
 * 1 = connected
 * 2 = connecting
 * 3 = disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};

const connect = async () => {
  return; // deshabilitado
  if (mongoConnection.isConnected) {
    console.log("Ya estabamos conectados");
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log("Usando conexión anterior");
      return;
    }

    await mongoose.disconnect();
  }

  await mongoose.connect(process.env.urlDB || "", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  mongoConnection.isConnected = 1;
  console.log("Conectado a MongoDB:", process.env.urlDB);
};

const disconnect = async () => {
  return; // deshabilitado
  if (process.env.NODE_ENV === "development") return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;

  console.log("Desconectado de MongoDB");
};

// Esta funcion la inicializo en el index.js y deshabilito connect y disconnect con returns initial
const initialConnect = async () => {
  mongoose
    .connect(process.env.urlDB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.log("Error conectando con la base de datos");
      console.log(err);
    });
};

const sendSlack = async (channel, text) => {
  try {
    let channel_value;

    if (channel === "support") {
      channel_value =
        "https://hooks.slack.com/services/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";
    } else if (channel === "test") {
      channel_value =
        "https://hooks.slack.com/services/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";
    }

    const resutl2 = await fetch(channel_value, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify({ text }),
    })
      .then((response) => {
        return response;
      })
      .catch((error) => console.log(error));
    return resutl2;
  } catch (err) {
    console.log(err);
  }
};

const actions = {
  LOGIN: "LOGIN",
  NUEVO_TICKET: "NUEVO TICKET",
  EDICION_TICKET: "EDICION TICKET",
  ELIMINACION_TICKET: "ELIMINACION TICKET",
  ASIGNACION_TICKET: "ASIGNACION TICKET",
  CONSULTA_TICKET: "CONSULTA TICKET",
  CONSULTA_CLIENTE: "CONSULTA CLIENTE",
  NUEVO_TASK: "NUEVA TAREA",
  EDICION_TASK: "EDICION TAREA",
};

const newAction = async ({ user, t, d = "" }) => {
  /*
  try {
    if (user._id) {
      await connect();
      const action = new Action({
        userId: user._id,
        type: t,
        description: d,
      });
      await action.save();
    }

    try {
      await syncActionsAirtable({
        user: user.name,
        type: t,
        description: d,
      });

      if (t === "LOGIN" || t === "NUEVO TICKET") {
        axios
          .get(
            `https://wirepusher.com/send?id=teYqmpsAc&title=${t}&message=${user.name}&type=PROSOLID3D`
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {});
      }
    } catch (err) {
      console.log(err);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await disconnect();
  }
  */
};

module.exports = {
  connect,
  newAction,
  disconnect,
  initialConnect,
  actions,
  sendSlack,
};
