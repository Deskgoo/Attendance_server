const { extractData } = require("./scripts/extractData");
const { transformAndMatchData } = require("./scripts/transformData");
const { postData } = require("./scripts/postData");

async function run() {
  try {
    console.log("Fetching MySQL data...");
    const mysqlData = await extractData();

    console.log("Transforming and matching data...");
    const transformedData = await transformAndMatchData(mysqlData);

    console.log("Posting data to Frappe...");
    await postData(transformedData);

    console.log("Process completed successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run();
