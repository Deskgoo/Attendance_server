const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const jar = new CookieJar();
const axiosInstance = wrapper(axios.create({ jar }));

let authToken;

async function login() {
  const url = "http://108.181.195.185:8000/api/method/login";
  const credentials = {
    usr: "Administrator",
    pwd: "deskgoo123",
  };

  try {
    const response = await axiosInstance.post(url, credentials);
    console.log("Login response:", response.data);
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const sidCookie = cookies.find((cookie) => cookie.startsWith("sid="));
      if (sidCookie) {
        authToken = sidCookie.split(";")[0]; // Get the sid value
        console.log("Extracted authToken (sid):", authToken);
      }
    }

    return {
      statusCode: response.status,
      authToken,
      message: response.data,
    };
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
    Cookie: authToken,
  };

  for (const item of data) {
    try {
      console.log(`Posting data: ${JSON.stringify(item)}`);
      const response = await axiosInstance.post(url, item, { headers });
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
      console.log("Logging in to Frappe...");
      await login();
      const rows = await extractData();
      const jsonData = transformData(rows);
      await postData(jsonData);
    } catch (error) {
      console.error("Error in main process:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
    }
  })();
}

module.exports = { login, postData };
