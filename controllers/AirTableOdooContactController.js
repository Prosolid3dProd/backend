var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keyfOttsWIc0Wp8x1";
const airtableBase = "app2xQHDOL46VyJLg";
const airtableTable = "Users";

const User = require("../models/OdooContacts");

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

const migrationAPIOdooContactsAirtable = async (
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
        is_company: Boolean(entity.is_company) ? 1 : 0,
        supplier: Boolean(entity.supplier),
        street: entity.street,
        city: entity.city,
        country: entity.country,
        name: entity.name,
        email: entity.email,
        commercial_company_name: entity.commercial_company_name,
        barcode: entity.barcode,
        phone: entity.phone,
        mobile: entity.mobile,
        website: entity.website,
        state: entity.state,
        zip: entity.zip,
        lang: entity.lang,
        customer: Boolean(entity.customer),
        vat: entity.vat,
        agent: Boolean(entity.agent),
        active: true,
        state_id: StringToInt(entity.state_id),
        country_id: StringToInt(entity.country_id),
        zip_id: StringToInt(entity.zip_id),
        city_id: StringToInt(entity.city_id),
        nuts1_id: StringToInt(entity.nuts1_id),
        nuts2_id: StringToInt(entity.nuts2_id),
        nuts3_id: StringToInt(entity.nuts3_id),
        nuts4_id: StringToInt(entity.nuts4_id),
        albaran_valorado: StringToInt(entity.albaran_valorado),
        tag1: entity.tag1,
        tag2: entity.tag2,
        tag3: entity.tag3,
        estado_clientes: entity.estado_clientes,
        odoo: entity.odoo,
        error: entity.error,
      });

      var params = [];
      params.push(inParams);
      odoo.execute_kw("res.partner", "create", params, function (err, value) {
        if (err) {
          return console.log(err);
        }
        if (value > 0) onSuccess(value);
        else onError(true);
      });
    });
  });
};

const migrationAPIOdooSupplierAirtable = async (
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
        is_company: Boolean(entity.is_company) ? 1 : 0,
        supplier: true,
        street: entity.street,
        name: entity.name,
        barcode: entity.barcode,
        phone: entity.phone,
        zip: entity.zip,
        customer: false,
        vat: entity.vat,
        agent: false,
        active: true,
        odoo: entity.odoo,
        error: entity.error,
      });

      var params = [];
      params.push(inParams);
      odoo.execute_kw("res.partner", "create", params, function (err, value) {
        if (err) {
          return console.log(err);
        }
        if (value > 0) onSuccess(value);
        else onError(true);
      });
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

const StringToInt = (value) => {
  if (value && value > 0) {
    return parseInt(value);
  }
  return null;
};

module.exports = {
  syncUsersAirtable,
  resetOdooContactsAirtable,
  migrationAPIOdooContactsAirtable,
  migrationAPIOdooSupplierAirtable,
  syncUsersAirtableWithData,
};
