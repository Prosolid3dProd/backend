var Airtable = require("airtable");
const moment = require("moment");

const airtableKey = "keypFxWFphcY9lYJP";
const airtableBase = "appSCxxlpZ6qdVB5G";
const airtableTable = "Tickets";

const Ticket = require("../models/Ticket");

const updateTicketsAi = ({ ticket, row }, { onSuccess = {}, onError = {} }) => {
  try {
    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).update(
      [
        {
          id: row.id,
          fields: fields_(ticket),
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

const createTicketsAi = (ticket, { onSuccess = {}, onError = {} }) => {
  try {
    const fields = [];

    fields.push({
      fields: fields_(ticket),
    });

    var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

    base(airtableTable).create(fields, function (err, records) {
      if (err) {
        onError(err);
        console.error(err);
        return;
      }

      records.forEach(function (record) {
        //console.log(record.getId());
      });
    });

    return;
  } catch (err) {
    console.log("error---->", err);
    onError(err);
    return null;
  }
};

const getTicketsIdAi = (ticket, { onSuccess = {} }) => {
  var base = new Airtable({ apiKey: airtableKey }).base(airtableBase);

  base(airtableTable)
    .select({
      filterByFormula: `AND(taskId = '${ticket._id}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      //console.log("records", records);
      if (records.length > 0) {
        onSuccess(records[0]);
      } else {
        onSuccess(null);
      }
    });
};

const syncTicketsAirtable = async (ticketId) => {
  try {
    const ticket = await Ticket.findOne({ _id: ticketId })
      .populate("ownerId")
      .populate("createdBy");

    if (ticket._id) {
      getTicketsIdAi(ticket, {
        onSuccess: (row) => {
          if (row !== null) {
            updateTicketsAi(
              { ticket, row },
              {
                onSuccess: (result1) => {},
                onError: (err) => {
                  console.log(err);
                },
              }
            );
          } else {
            createTicketsAi(ticket, {
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
    responsable: i.ownerId.name || "Gloria",
    owner1avatar: i.ownerId.avatar || null,
    message: i.message || "",
    status: i.status || "",
    avatar: i.ownerId.avatar || "",
    phone: i.phone || "",
    software: i.software || "No Especifica",
    company: i.company || "",
    observation: i.observation || "",
    resume: `${i.ownerId.name} || ${i.service} || ${i.company} `,
    code: i.serial || "",
    duration: i.duration || 0,
    email: i.email || "",
    archived: moment(i.archived).format("YYYY-MM-DD"),
    origin: i.origin || "",
    closuredate: moment(i.closuredate).format("YYYY-MM-DD"),
    startdate: moment(i.startdate).format("YYYY-MM-DD"),
    priority: i.priority || "mid",
    service: i.service || "Instalación",
    type: i.type || "installation",
    emailOwner: i.ownerId.email || "",
    emailCreatedBy: i.createdBy.email || "",
    blocker: String(i.blocker) || "false",
    isActive: String(i.isActive) === "true" ? "true" : "false",
    taskId: i._id || "",
    maintenance: String(i.maintenance) === "true" ? "true" : "false",
    slackId: String(i.slackUser) || "false",
    slackEmail: String(i.emailUser) || "",
    onholdCompany: String(i.onholdClient) || "false",
    mode: String(i.mode) || "No Especial",
  };
};

module.exports = {
  syncTicketsAirtable,
};
