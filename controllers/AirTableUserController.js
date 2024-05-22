var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keypFxWFphcY9lYJP";
const airtableBase = "appSCxxlpZ6qdVB5G";
const airtableTable = "Users";

const User = require("../models/User");

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

const resetUsersAirtable = async () => {
  const fechaExpiracion = "2022/01/01";
  const user = await User.find({
    role: "client",
    expired: { $gte: new Date(fechaExpiracion) },
  });
  user.forEach((entity) => {
    createUsersAi(entity, {
      onSuccess: (res) => {
        console.log("id", res._id);
      },
      onError: (err) => {
        console.log(err);
      },
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

const fields_ = (i) => {
  return {
    expired: moment(i.expired).format("YYYY-MM-DD"),
    initiation: moment(i.expired).subtract(1, "years").format("YYYY-MM-DD"),
    code: String(i.code || ""),
    company: String(i.company) || "",
    license: `${String(i.company) || ""}-${String(i.software || "")}`,
    email: String(i.email) || "",
    software: String(i.software) || "",
    name: String(i.name) || "",
    role: String(i.role) || "client",
    domain: String(i.domain) || "",
    voucher: booleanToString(i.voucher),
    active: booleanToString(i.active),
    userId: String(i._id) ? i._id : null,
    owner: i.owner || "",
  };
};

const booleanToString = (value) => {
  return String(value) === "true" ? "true" : "false";
};

module.exports = {
  syncUsersAirtable,
  resetUsersAirtable,
};
