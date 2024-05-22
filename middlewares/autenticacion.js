const jwt = require("jsonwebtoken");
const Instance = require("../models/Instance");

const instancePublic = "65620909886d34dd726a9827";
/*
let verificarToken = (req, res, next) => {
  let token = req.get("Authorization");
  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decoded.usuario;

    if (req.user) {
      req.token = token;
      next();
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
  });
};
*/

let verificarToken = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.user = decoded.usuario;

    if (req.user) {
      Instance.findOne({ _id: req.user.instanceId }, (err, result) => {
        if (result && result._id) {
          req.instance = result;
          req.token = token;
          req.user = req.user;
          req.instancePublic = instancePublic;
          next();
        } else {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
      });
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
  });
};

//Coohom Report
let verificarTokenExpress = (req, res, next) => {
  let token = req.get("Authorization");

  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      req.user = decoded.usuario;
      next();
    }
  });

  /*
  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    if (req.user) {
      req.user = decoded.usuario;
      next();
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
    */

  /*
    if (req.user) {
      Instance.findOne({ _id: req.user.instanceId }, (err, result) => {
        if (result && result._id) {
          req.instance = result;
          req.token = token;
          req.user = req.user;

          next();
        } else {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
      });
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
    */
  // });
};

let verificarTokenByPost = (req, res, next) => {
  const { token } = req.body;

  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decoded.usuario;

    if (req.user) {
      Instance.findOne({ _id: req.user.instanceId }, (err, result) => {
        if (result && result._id) {
          req.instance = result;
          req.token = token;
          req.instancePublic = instancePublic;
          next();
        } else {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
      });
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
  });
};

let verificarInstanceToken = (req, res, next) => {
  const { token } = req.body;

  jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }

    req.user = decoded.usuario;

    if (req.user) {
      Instance.findOne({ _id: req.user.instanceId }, (err, result) => {
        if (result && result._id) {
          req.instance = result;
          req.token = token;
          next();
        } else {
          return res.status(401).json({
            ok: false,
            err,
          });
        }
      });
    } else {
      console.log(err);
      return res.status(401).json({
        message: "Se requiere un token",
      });
    }
  });
};

let ramdomCode = () => {
  const xx = new Date();
  return `${Math.floor(
    Math.random() * 1000
  )}${xx.getFullYear()}${xx.getMonth()}${xx.getDate()}${xx.getSeconds()}`;
};

const makeCode = (length = 10) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};
module.exports = {
  verificarToken,
  verificarInstanceToken,
  verificarTokenByPost,
  ramdomCode,
  verificarTokenExpress,
  makeCode,
};
