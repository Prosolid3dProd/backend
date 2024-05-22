const SystemLog = require("../models/SystemLog");

const setSystemLog = async ({ m, u = null, o = null, t = "info" }) => {
  try {
    const system = new SystemLog({
      userId: u,
      ownerId: o,
      type: t,
      message: m,
    });
    return await system.save();
  } catch (err) {
    console.log(err);
  } finally {
  }
};

module.exports = {
  setSystemLog,
};
