var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keyfOttsWIc0Wp8x1";
const airtableBase = "app2xQHDOL46VyJLg";
const airtableTable = "Users";

const Product = require("../models/OdooProducts");

const updateUsersAi = ({ user, row }, { onSuccess = {}, onError = {} }) => {
  try {
    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).update(
      [
        {
          id: row.id,
          fields: fields_(user),
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

const createUsersAi = (user, { onSuccess = {}, onError = {} }) => {
  try {
    const fields = [];
    fields.push({
      fields: fields_(user),
    });

    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).create(fields, function (err, records) {
      if (err) {
        onError(err);
        console.error(err);
        return;
      }

      records.forEach(function (record) {
        console.log(record.getId());
      });
    });

    return;
  } catch (err) {
    console.log("error---->", err);
    onError(err);
    return null;
  }
};

const getUsersIdAi = (user, { onSuccess = {} }) => {
  var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

  base(airtableTable)
    .select({
      filterByFormula: `AND(userId = '${user._id}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      console.log("records", records);
      if (records.length > 0) {
        onSuccess(records[0]);
      } else {
        onSuccess(null);
      }
    });
};

const resetOdooContactsAirtable = async () => {
  const user = await User.find();
  let time = 0;
  user.forEach((entity) => {
    time = time + 400;
    setTimeout(() => {
      createUsersAi(entity, {
        onSuccess: (res) => {
          console.log("id", res._id);
        },
        onError: (err) => {
          console.log(err);
        },
      });
    }, time);
  });
};

const migrationAPIOdooProductsAirtable = async (
  entity,
  odoo,
  { onSuccess = {}, onError = {} }
) => {
  odoo.connect(function (err) {
    if (err) {
      return console.log(err);
    }

    odoo.connect(function (err) {
      if (err) {
        return console.log(err);
      }
      var inParams = [];
      console.log({
        name: entity.name_v1,
        type: entity.type === "almacenable" ? "product" : "service",
        categ_id: toNumber(entity.categ_id),
        list_price: toNumber(entity.price),
        uos_list_price: toNumber(entity.uos_list_price),
        volume: toNumber(entity.volume),
        weight: toNumber(entity.weight),
        sale_ok: Boolean(entity.sale_ok),
        purchase_ok: Boolean(entity.purchase_ok),
        responsible_id: 1,
        expense_policy: String("no"),
        invoice_policy: entity.purchase_method === "entregadas" ? 1 : 0,
        purchase_method: toString(entity.purchase_method),
        can_be_expensed: Boolean(entity.can_be_expensed),
        // uos_measure_type: String("fijo"),
        thickness: toNumber(entity.thickness),
        length: toNumber(entity.length),
        transfer_measures: Boolean(entity.transfer_measures),
        width: toNumber(entity.width),
        default_code: String(entity.default_code),
      });

      inParams.push({
        description_sale: nameVersions(entity),
        name: String(entity.name),
        type: entity.type === "almacenable" ? "product" : "service",
        categ_id: toNumber(entity.categ_id),
        list_price: parseFloat(entity.price2),
        uos_list_price: parseFloat(entity.uos_list_price),
        volume: toNumber(entity.volume),
        weight: toNumber(entity.weight),
        sale_ok: Boolean(entity.sale_ok),
        purchase_ok: Boolean(entity.purchase_ok),
        responsible_id: 1,
        expense_policy: String("no"),
        invoice_policy: entity.purchase_method === "entregadas" ? 1 : 0,
        purchase_method: toString(entity.purchase_method),
        can_be_expensed: Boolean(entity.can_be_expensed),
        thickness: toNumber(entity.thickness),
        length: toNumber(entity.length),
        transfer_measures: Boolean(entity.transfer_measures),
        width: toNumber(entity.width),
        default_code: String(entity.default_code),
        barcode: String(entity.barcode),
        description_purchase: nameVersions(entity),
        uos_measure_id: toMeasure(entity.uos_measure_id),
        uom_uos_equivalence: toNumber(entity.volume),
        uos_coeff: toNumber(entity.surface),
      });

      var params = [];
      params.push(inParams);
      odoo.execute_kw(
        "product.template",
        "create",
        params,
        function (err, value) {
          if (err) {
            return console.log(err);
          }
          if (value > 0) onSuccess(value);
          else onError(true);
        }
      );
    });
  });
};

const migrationAPIOdooProductsSupplierAirtable = async (
  entity,
  odoo,
  { onSuccess = {}, onError = {} }
) => {
  odoo.connect(function (err) {
    if (err) {
      return console.log(err);
    }

    odoo.connect(function (err) {
      if (err) {
        return console.log(err);
      }
      var inParams = [];

      inParams.push({
        name: toNumber(entity.company_id),
        product_barcode: String(entity.barcode),
        product_name: entity.supplier,
        product_id: toNumber(entity.product_id),
        product_code: toNumber(entity.product_code),
        price: parseFloat(entity.price),
      });

      var params = [];
      params.push(inParams);
      odoo.execute_kw(
        "product.supplierinfo",
        "create",
        params,
        function (err, value) {
          if (err) {
            return console.log(err);
          }
          if (value > 0) onSuccess(value);
          else onError(true);
        }
      );
    });
  });
};

const migrationAPIOdooProductsProductAirtable = async (
  entity,
  odoo,
  { onSuccess = {}, onError = {} }
) => {
  odoo.connect(function (err) {
    if (err) {
      return console.log(err);
    }

    odoo.connect(function (err) {
      if (err) {
        return console.log(err);
      }
      var inParams = [];

      inParams.push({
        default_code: String(entity.default_code),
        barcode: String(entity.barcode),
        volume: toNumber(entity.volume),
        weight: toNumber(entity.weight),
        thickness: toNumber(entity.thickness),
        length: toNumber(entity.length),
        width: toNumber(entity.width),
        product_tmpl_id: toNumber(entity.odoo),
        list_price: toNumber(entity.price),
        ous_list_price: toNumber(entity.ous_list_price),
      });

      var params = [];
      params.push(inParams);
      odoo.execute_kw(
        "product.product",
        "create",
        params,
        function (err, value) {
          if (err) {
            return console.log(err);
          }
          if (value > 0) onSuccess(value);
          else onError(true);
        }
      );
    });
  });
};

const syncUsersAirtable = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (user._id) {
      getUsersIdAi(user, {
        onSuccess: (row) => {
          if (row !== null) {
            updateUsersAi(
              { user, row },
              {
                onSuccess: (result1) => {},
                onError: (err) => {
                  console.log(err);
                },
              }
            );
          } else {
            createUsersAi(user, {
              onSuccess: (result1_) => {},
              onError: (err) => {
                console.log(user, err);
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

const syncUsersAirtableWithData = async (user) => {
  try {
    if (user._id) {
      getUsersIdAi(user, {
        onSuccess: (row) => {
          if (row !== null) {
            updateUsersAi(
              { user, row },
              {
                onSuccess: (result1) => {},
                onError: (err) => {
                  console.log(err);
                },
              }
            );
          } else {
            createUsersAi(user, {
              onSuccess: (result1_) => {},
              onError: (err) => {
                console.log(user, err);
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
    code: String(i.code || ""),
    migration: String(Boolean(i.migration)),
    is_company: String(i.is_company || ""),
    name: String(i.name || ""),
    display_name: String(i.display_name || ""),
    street: String(i.street || ""),
    city: String(i.city || ""),
    zip: String(i.zip || ""),
    country: String(i.country || ""),
    vat: String(i.vat || ""),
    phone: String(i.phone || ""),
    mobile: String(i.mobile || ""),
    website: String(i.website || ""),
    email: String(i.email || ""),
    lang: String(i.lang || ""),
    customer: booleanToString(i.customer),
    commercial_company_name: String(i.commercial_company_name || ""),
    supplier: booleanToString(i.supplier),
    agent: booleanToString(i.agent),
    state2: String(i.state2 || ""),
    state: String(i.state || ""),
    barcode: String(i.barcode || ""),
    cuenta_cliente: String(i.cuenta_cliente || ""),
    cuenta_proveedor: String(i.cuenta_proveedor || ""),
    state_id: String(i.state_id || ""),
    city_id: String(i.city_id || ""),
    zip_id: String(i.zip_id || ""),
    country_id: String(i.country_id || ""),
    nuts1_id: String(i.nuts1_id || ""),
    nuts2_id: String(i.nuts2_id || ""),
    nuts3_id: String(i.nuts3_id || ""),
    nuts4_id: String(i.nuts4_id || ""),
    tag1: String(i.nuts1_id || ""),
    tag2: String(i.nuts2_id || ""),
    tag3: String(i.nuts3_id || ""),
    estado_clientes: String(i.nuts3_id || ""),
    albaran_valorado: String(i.nuts3_id || ""),
  };
};

const booleanToString = (value) => {
  return String(value) === "true" ? "true" : "false";
};

const toString = (value) => {
  if (value === undefined) return "";
  return String(value);
};

const nameVersions = (value) => {
  const x = String(String(value.name).split(" X ")[0]).split(" ");
  let name = "";
  for (let i = 0; i < x.length - 1; i++) {
    name = `${name} ${x[i]}`;
  }
  console.log(value.name, name);
  return name;
};

const StringToInt = (value) => {
  if (value && value > 0) {
    return parseInt(value);
  }
  return null;
};

const measureToInt = (value) => {
  if (value === "UNIDAD(ES)") {
    return 1;
  }

  if (value === "CAJAS") {
    return 1;
  }
};

const toMeasure = (value) => {
  if (value === "m2") return 25;
  if (value === "m") return 8;
  return null;
};

const toNumber = (value) => {
  if (value === undefined) return 0;
  return parseFloat(value);
};

module.exports = {
  migrationAPIOdooProductsAirtable,
  migrationAPIOdooProductsProductAirtable,
};
