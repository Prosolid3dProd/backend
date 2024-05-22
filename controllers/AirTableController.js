var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keypPJd11SCDxFUsw";
const airtableBase = "appxzTu9aj2n4A1wM";

const User = require("../models/User");

const updateUsersAi = ({ user, row }, { onSuccess = {}, onError = {} }) => {
  try {
    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base("User").update(
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

    base("User").create(fields, function (err, records) {
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
    console.log(err, fields_(user));
    onError(err);
    return null;
  }
};

const getUsersIdAi = (user, { onSuccess = {} }) => {
  var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

  base("User")
    .select({
      filterByFormula: `AND(userId = '${user._id}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      if (records.length > 0) {
        onSuccess(records[0]);
      } else {
        onSuccess(null);
      }
    });
};

const syncUsersAirtable = async (userId) => {
  try {
    const user = await User.findById(userId).lean();
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
                console.log(err);
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
    company: i.company || "",
    email: i.email || "",
    software: i.software || "",
    name: i.name || "",
    code: String(i.serial || ""),
    role: i.roles || "client",
    domain: i.domain || "",
    voucher: i.voucher || "",
    active: String(i.active) || "unknow",
    userId: i._id ? i._id : null,
  };
};

module.exports = {
  syncUsersAirtable,
};
