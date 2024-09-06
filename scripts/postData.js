// scripts/post_data.js
const axios = require("axios");
const { transformData } = require("./transformData");

async function postData(data) {
  // Frappe API endpoint on the same VPS
  const url =
    "http://108.181.195.185:8000/api/method/frappe.desk.form.save.savedocs";

  // Define headers, including authentication if necessary
  const headers = {
    "Content-Type": "application/json",
    Authorization: "token 8db5986f9a7e48c:8f1a6779b365180 ",
  };

  // Post each formatted document to Frappe
  for (const item of data) {
    try {
      const response = await axios.post(url, item, { headers });
      console.log(response.data); // Print response for debugging
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }
}

if (require.main === module) {
  (async () => {
    const rows = await extractData();
    const jsonData = transformData(rows);
    await postData(jsonData);
  })();
}
