const axios = require("axios");
const { extractData } = require("./extractData");
const { transformData } = require("./transformData");

let authToken = null;

async function login() {
  const url = "http://108.181.195.185:8000/api/method/login";
  const credentials = {
    usr: "Administrator",
    pwd: "Deskgoo123",
  };

  try {
    const response = await axios.post(url, credentials, {
      withCredentials: true,
    });

    authToken = response.headers["set-cookie"]; // For cookies
    // authToken = response.data.token; // For token-based authentication

    console.log("Login successful!");
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Login failed");
  }
}

async function postData(data) {
  const url =
    "http://108.181.195.185:8000/api/method/frappe.desk.form.save.savedocs";

  const headers = {
    "Content-Type": "application/json",
    Cookie: authToken, // For cookies
    // Authorization: `Bearer ${authToken}`, // For token-based authentication
  };

  for (const item of data) {
    try {
      const response = await axios.post(url, item, { headers });
      console.log(response.data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }
}

if (require.main === module) {
  (async () => {
    try {
      await login();
      const rows = await extractData();
      const jsonData = transformData(rows);
      await postData(jsonData);
    } catch (error) {
      console.error("Error in main process:", error.message);
    }
  })();
}

module.exports = { login, postData };
