const mysql = require("mysql2/promise");

async function extractData() {
  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: "202.51.3.49",
    user: "root",
    password: "telemko",
    database: "adms",
  });

  // Query to fetch data
  const [rows] = await connection.execute("SELECT * FROM attendances");

  // Close connection
  await connection.end();

  return rows;
}

if (require.main === module) {
  (async () => {
    const data = await extractData();
    console.log(data);
  })();
}

module.exports = { extractData };
