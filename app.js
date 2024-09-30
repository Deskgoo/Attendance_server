const { extractData } = require("./scripts/extractData");
const { transformAndMatchData } = require("./scripts/transformData");
const { login, postData } = require("./scripts/postData");

async function run() {
  try {
    // Step 1: Login to Frappe
    console.log("Logging in to Frappe...");
    const { message, authToken, statusCode } = await login();

    // Step 2: Check if login is successful based on message and status code
    if (statusCode === 200) {
      console.log("Login successful!");

      // Step 3: Extract data from MySQL
      console.log("Fetching MySQL data...");
      const mysqlData = await extractData();

      // Step 4: Transform and match data from MySQL with Frappe records
      console.log("Transforming and matching data...");
      const transformedData = await transformAndMatchData(mysqlData);

      // Step 5: Post transformed data to Frappe
      console.log("Posting data to Frappe...");
      await postData(transformedData, authToken); // Pass authToken for authentication

      console.log("Process completed successfully!");
    } else {
      // Abort if login fails
      console.log("Login failed. Message:", message); // Log the message from the login response
      console.log("Aborting the process.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
