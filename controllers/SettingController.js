const { connect, disconnect } = require("../models/db");

const SETTING = require("../constants/Setting");

const Setting = require("../models/Setting");

const settingGetLastSerial = async () => {
  await connect();
  const data = await Setting.findOne({ company: SETTING.company.main }).lean();
  if (data._id) {
    let serial = parseInt(data.serial) + 1;
    const newSerial = await Setting.findByIdAndUpdate(
      data._id,
      { serial },
      { new: true }
    );
    await disconnect();
    console.log(newSerial);
    return `${getRandomArbitrary()}${newSerial.serial}`;
  } else {
    return null;
  }
};

const getRandomArbitrary = () => {
  return Math.floor(Math.random() * (99 - 10) + 10);
};

module.exports = { settingGetLastSerial };
