const moment = require("moment");
moment.locale("es");

const { globals } = require("../middlewares/constants");

const priceFormat = (text) => `$ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const dateFormat = (date) => moment(date).format("L");
const dateFormat2 = (date) => moment(date).format("LL");
const dateFormat4 = (date) => moment(date).format(" dddd MMMM Do YYYY"); // July 2nd 2021, 3:19:33 am
const birthdate = (date) => moment(date).month(0).from(moment().month(0));
const birthdate2 = (date) => {
  const nacimiento = moment(date);
  const hoy = moment();
  const anios = hoy.diff(nacimiento, "years");
  return anios;
};

const paymentMode = (mode) => {
  if (mode === globals.TRANS.PAYMENT_MODE.CASH) return "Efectivo";
  else if (mode === globals.TRANS.PAYMENT_MODE.DEBITCARD)
    return "Tarjeta de Débito";
  else if (mode === globals.TRANS.PAYMENT_MODE.CREDITCARD)
    return "Tarjeta de Crédito";
  else if (mode === globals.TRANS.PAYMENT_MODE.TRANSFER) return "Transferencía";
  else return "Otro";
};

module.exports = {
  priceFormat,
  dateFormat,
  dateFormat2,
  paymentMode,
  dateFormat4,
  birthdate2,
  birthdate,
};
