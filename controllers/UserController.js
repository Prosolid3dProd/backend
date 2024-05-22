const { connect, disconnect } = require("../models/db");
const { syncUsersAirtable } = require("../controllers/AirTableUserController");

const User = require("../models/User");

const getUser = async (id) => {
  await connect();
  const data = await User.findById(id).lean();
  await disconnect();
  if (data._id) {
    return data;
  } else {
    return null;
  }
};

const setVaucherToUser = async (id) => {
  await connect();
  const data = await User.findById(id);
  const data1 = await User.findByIdAndUpdate(id, {
    comodin: parseInt(data.comodin) + 1,
  });

  // syncUsersAirtable(id);
  await disconnect();
  if (data._id) {
    return data;
  } else {
    return null;
  }
};

const getUserInfo = async (id) => {
  await connect();
  const data = await User.findById(id).lean();
  await disconnect();
  if (data._id) {
    return data;
  } else {
    return null;
  }
};

const setDomainByHubspot = async (company, domain, email = null) => {
  await connect();
  const data = await User.updateMany({ company }, { domain, email });

  try {
    data.forEach((item) => {
      syncUsersAirtable(item._id);
    });
  } catch (err) {
    console.log(err);
  }

  await disconnect();
  if (data._id) {
    return data;
  } else {
    return null;
  }
};

module.exports = {
  getUser,
  setVaucherToUser,
  getUserInfo,
  setDomainByHubspot,
};
