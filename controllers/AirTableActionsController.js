var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keypFxWFphcY9lYJP";
const airtableBase = "appSCxxlpZ6qdVB5G";
const airtableTable = "Actions";

const createAi = (data, { onSuccess = {}, onError = {} }) => {
  try {
    const fields = [];

    fields.push({
      fields: fields_(data),
    });

    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).create(fields, function (err, records) {
      if (err) {
        onError(err);
        console.error(err);
        return;
      }

      records.forEach(function (record) {
        // console.log(record.getId());
      });
    });

    return;
  } catch (err) {
    console.log("error---->", err);
    onError(err);
    return null;
  }
};

const syncActionsAirtable = async (data) => {
  try {
    createAi(data, {
      onSuccess: (result1_) => {},
      onError: (err) => {
        console.log(err);
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const fields_ = (i) => {
  return {
    user: i.user,
    type: i.type,
    description: i.description || "",
  };
};

module.exports = {
  syncActionsAirtable,
};
