const axios = require("axios");
const { extractData } = require("./extractData");
const { transformData } = require("./transformData");

let authToken = null;
async function login() {
  const url = "http://108.181.195.185:8000/api/method/login";
  const credentials = {
    usr: "Administrator",
    pwd: "deskgoo123",
  };

  try {
    const response = await axios.post(url, credentials, {
      withCredentials: true,
    });

    const statusCode = response.status;
    const authToken = response.headers["set-cookie"]; // Capture the session cookies

    console.log("Login successful!");

    // Return status and authToken for further use
    return { statusCode, authToken };
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
    Cookie: authToken, // For cookies (e.g., sid)
    // Authorization: `Bearer ${authToken}`, // Uncomment if using token-based auth
  };

  for (const item of data) {
    try {
      console.log(`Posting data: ${JSON.stringify(item)}`);
      const response = await axios.post(url, item, { headers });
      console.log("Post successful:", response.data);
    } catch (error) {
      console.error(
        "Error posting data:",
        error.response ? error.response.data : error.message
      );
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
