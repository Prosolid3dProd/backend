var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keypFxWFphcY9lYJP";
const airtableBase = "appSCxxlpZ6qdVB5G";
const airtableTable = "Ordenes";

const Order = require("../models/Order");

const updateOrdersAi = ({ order, row }, { onSuccess = {}, onError = {} }) => {
  try {
    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).update(
      [
        {
          id: row.id,
          fields: fields_(order),
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          onError(err);
          return;
        }
        records.forEach(function (record) {
          onSuccess();
        });
      }
    );

    return;
  } catch (err) {
    onError(err);
    return null;
  }
};

const createOrdersAi = (order, { onSuccess = {}, onError = {} }) => {
  try {
    const fields = [];

    fields.push({
      fields: fields_(order),
    });

    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).create(fields, function (err, records) {
      if (err) {
        onError(err);
        console.error(err);
        return;
      }

      records.forEach(function (record) {
        //console.log(record.getId());
      });
    });

    return;
  } catch (err) {
    console.log("error---->", err);
    onError(err);
    return null;
  }
};

const getOrdersIdAi = (order, { onSuccess = {} }) => {
  var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

  base(airtableTable)
    .select({
      filterByFormula: `AND(OrderId = '${order._id}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      if (records.length > 0) {
        onSuccess(records[0]);
      } else {
        onSuccess(null);
      }
    });
};

const syncOrdersAirtable = async (orderId) => {
  try {
    const order = await Order.findOne({ _id: orderId });

    if (order._id) {
      getOrdersIdAi(order, {
        onSuccess: (row) => {
          if (row !== null) {
            updateOrdersAi(
              { order, row },
              {
                onSuccess: (result1) => {},
                onError: (err) => {
                  console.log(err);
                },
              }
            );
          } else {
            createOrdersAi(order, {
              onSuccess: (result1_) => {},
              onError: (err) => {
                console.log(err);
              },
            });
          }
        },
        onError: () => {},
      });
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

const fields_ = (i) => {
  return {
    Estado: i.status || "onhold",
    Precio: String(i.price) || "",
    Telefono: i.phone || "",
    Email: i.email || "",
    Direccion: i.address || "",
    Nombre: i.fullname || "",
    Codigo: i.code || "",
    Observacion: i.observation || "",
    Modelo: i.code || "",
    Fecha: moment(i.createdAt).format("YYYY-MM-DD"),
    NumModulos: String(i.numModulos),
    OrderId: i._id || "",
  };
};

module.exports = {
  syncOrdersAirtable,
};
