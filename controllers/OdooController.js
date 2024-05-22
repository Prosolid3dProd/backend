require("../config/config");

const Odoo = require("odoo-xmlrpc");

const odoo = new Odoo({
  url: "https://zzpreprod-emedec.binovoerp.es/",
  db: "zzpreprod-emedec",
  username: "pedro@prosolid3d.com",
  password: process.env.PASSWORDODDO,
});

const odooVerifyModelsByName = async (
  { name, model, column = "name", field = "id" },
  { onSuccess = {} }
) => {
  return odoo.connect(function async(err) {
    if (err) {
      return null;
    }
    console.log(`Connected ${model} to Odoo server.`);
    var inParams = [];
    inParams.push([[column, "=", name]]);
    inParams.push([field]); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    var params = [];
    params.push(inParams);
    return odoo.execute_kw(model, "search_read", params, function (err, value) {
      if (err) {
        return console.log(err);
      }

      if (value[0]) {
        onSuccess({ name, model, ...value[0] });
      } else {
        onSuccess(null);
      }

      return value;
    });
  });
};

const odooVerifyStateCountryByName = async (
  { name, model, column = "name", field = "id" },
  { onSuccess = {} }
) => {
  return odoo.connect(function async(err) {
    if (err) {
      return null;
    }
    var inParams = [];
    inParams.push([[column, "=", name]]);
    inParams.push(["id", "country_id"]); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    var params = [];
    params.push(inParams);
    return odoo.execute_kw(model, "search_read", params, function (err, value) {
      if (err) {
        return console.log(err);
      }

      if (value[0]) {
        onSuccess({ name, model, ...value[0] });
      } else {
        onSuccess(null);
      }

      return value;
    });
  });
};

const odooVerifyCityZipByName = async (
  { name, model, column = "name", field = "id" },
  { onSuccess = {} }
) => {
  return odoo.connect(function async(err) {
    if (err) {
      return null;
    }
    var inParams = [];
    inParams.push([[column, "=", name]]);
    inParams.push(["id", "city_id"]); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    var params = [];
    params.push(inParams);
    return odoo.execute_kw(model, "search_read", params, function (err, value) {
      if (err) {
        return console.log(err);
      }

      if (value[0]) {
        onSuccess({ name, model, ...value[0] });
      } else {
        onSuccess(null);
      }

      return value;
    });
  });
};

const odooVerifyNutsByName = async (
  { name, model, column = "name", field = "id" },
  { onSuccess = {}, onError = {} }
) => {
  return odoo.connect(function async(err) {
    if (err) {
      console.log("no hay conexion con odoo");
      return null;
    } else {
      var inParams = [];
      inParams.push([[column, "=", name]]);
      inParams.push([field]); //fields
      inParams.push(0); //offset
      inParams.push(1); //limit
      var params = [];
      params.push(inParams);
      return odoo.execute_kw(
        model,
        "search_read",
        params,
        function (err, value) {
          if (err) {
            onError(err);
            console.log(err);
          }

          if (value[0]) {
            onSuccess({ name, model, ...value[0] });
          } else {
            console.log("Error", name);
            onError(err);
          }

          return value;
        }
      );
    }
  });
};

const odooVerifyModelsByNameProduct = async (
  { name, model, column = "name", field = "id" },
  { onSuccess = {} }
) => {
  return odoo.connect(function async(err) {
    if (err) {
      console.log(err);
      return null;
    }
    //  console.log(`Connected ${model} to Odoo server.`);
    var inParams = [];
    inParams.push([[column, "=", name]]);
    inParams.push([field]); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    var params = [];
    params.push(inParams);
    return odoo.execute_kw(model, "search_read", params, function (err, value) {
      if (err) {
        return console.log(err);
      }
      onSuccess(value);
      return value;
    });
  });
};

module.exports = {
  odooVerifyModelsByName,
  odooVerifyStateCountryByName,
  odooVerifyCityZipByName,
  odooVerifyNutsByName,
  odooVerifyModelsByNameProduct,
};
