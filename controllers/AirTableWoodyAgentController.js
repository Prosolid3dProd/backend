const axios = require("axios");

const apiUrl = `https://api.airtable.com/v0/appSCxxlpZ6qdVB5G/woody`;
const authToken =
  "patqphvV6744RdYOO.980f6c6daf3d6553f42d4f52773272df424dd2200e8a55356a295be4050db99f";

const saveWoodyAgentComercialAirtable = async (fields) => {
  console.log(fields);

  const data = {
    records: [
      {
        fields,
      },
    ],
  };

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  axios
    .post(apiUrl, data, { headers })
    .then((response) => {
      console.log("Solicitud exitosa:", response.data);
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error.message);
    });
};

const getComercialVisit = async (data) => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  return axios
    .get(apiUrl, { headers })
    .then((response) => {
      console.log("Solicitud exitosa:", response.data.records);
      return response.data.records;
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error.message);
      return [];
    });
};

const getConfiguratorAirTable = async () => {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const apiUrl = `https://api.airtable.com/v0/appSCxxlpZ6qdVB5G/tblzpjJWBxn7j6TkV`;

  return axios
    .get(apiUrl, { headers })
    .then((response) => {
      return response.data.records;
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error.message);
      return [];
    });
};

module.exports = {
  saveWoodyAgentComercialAirtable,
  getComercialVisit,
  getConfiguratorAirTable,
};
