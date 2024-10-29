// Import dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const employeeRoutes = require("./data/route/employeeAddroute"); // Adjust path if needed

const { extractData } = require("./scripts/extractData");
const { transformAndMatchData } = require("./scripts/transformData");
const { login, postData } = require("./scripts/postData");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(employeeRoutes);

// Server setup
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Main function for data processing and posting to Frappe
async function run() {
  try {
    // Step 1: Login to Frappe
    console.log("Logging in to Frappe...");
    const { message, authToken, statusCode } = await login();

    // Step 2: Check if login is successful based on message and status code
    if (statusCode === 200) {
      console.log("Login successful!");

      while (true) {
        // Step 3: Extract data from MySQL
        console.log("Fetching MySQL data...");
        const mysqlData = await extractData();

        if (mysqlData.length > 0) {
          // Step 4: Transform and match data from MySQL with Frappe records
          console.log("Transforming and matching data...");
          const transformedData = await transformAndMatchData(mysqlData);

          // Step 5: Post transformed data to Frappe
          console.log("Posting data to Frappe...");
          await postData(transformedData, authToken);

          console.log("Data posted successfully!");
        } else {
          console.log("No new data found. Waiting for new records...");
        }

        await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds delay
      }
    } else {
      // Abort if login fails
      console.log("Login failed. Message:", message);
      console.log("Aborting the process.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();

module.exports = app;
