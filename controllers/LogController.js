const Log = require("../models/Log");

const TYPE = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
};

const registerLog = ({
  owner = "system",
  message,
  type = TYPE.info,
  avatar = null,
}) => {
  const log = new Log({
    message,
    type,
    avatar,
    owner,
  });

  return log.save();
};

module.exports = {
  registerLog,
};
