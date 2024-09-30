const axios = require("axios");

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

// Function to post data to Frappe
async function postData(authToken, data) {
  const postUrl = "http://108.181.195.185:8000/api/resource/YourDoctype"; // Update to your correct API endpoint

  try {
    const response = await axios.post(postUrl, data, {
      headers: {
        Cookie: authToken, // Use the session token for authentication
        "Content-Type": "application/json",
      },
    });

    console.log("Data posted successfully:", response.data);
  } catch (error) {
    console.error(
      "Failed to post data:",
      error.response ? error.response.data : error.message
    );
  }
}

// Example of how to use the login and post functions together
async function main() {
  try {
    const { authToken } = await login();

    // Example data to post, replace with your actual data
    const data = {
      doc: {
        doctype: "YourDoctype", // Replace with your actual Doctype
        field1: "value1", // Add your fields and values here
        field2: "value2",
      },
    };

    await postData(authToken, data); // Use the authToken and post data
  } catch (error) {
    console.error("Process failed:", error.message);
  }
}

// Run the process
main();
