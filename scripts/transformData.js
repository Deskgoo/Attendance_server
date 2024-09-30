const fs = require("fs");
const path = require("path");
const { extractData } = require("./extractData");

const EMPLOYEE_MAPPING_PATH = path.join(__dirname, "../data/employeeMap.json");

// Load employee mappings from a JSON file
async function loadEmployeeMappings() {
  return new Promise((resolve, reject) => {
    fs.readFile(EMPLOYEE_MAPPING_PATH, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

// Transform and match data from MySQL with employee mappings
async function transformAndMatchData() {
  try {
    const mysqlData = await extractData();
    const employeeMappings = await loadEmployeeMappings();

    // Create a mapping of device_employee_id to employee_id and employee_name
    const employeeMap = employeeMappings.reduce((map, employee) => {
      map[employee.device_employee_id] = {
        employee_id: employee.employee_id,
        employee_name: employee.employee_name,
      };
      return map;
    }, {});

    // Time difference in minutes (135 minutes in this case)
    const timeDifferenceMinutes = 135;

    // Transform the MySQL data into the desired format
    const transformedData = mysqlData.map((row) => {
      const logType = row.status1 === 0 ? "IN" : "OUT";
      const employeeData = employeeMap[row.employee_id] || {
        employee_id: "Unknown",
        employee_name: "Unknown",
      };

      // Adjust the timestamp to account for the time difference
      const localTimestamp = new Date(row.timestamp);
      const adjustedTimestamp = new Date(
        localTimestamp.getTime() - timeDifferenceMinutes * 60 * 1000
      ); // Adjust timestamp

      const doc = {
        docstatus: 0,
        doctype: "Employee Checkin",
        name: `new-employee-checkin-${row.id}`, // Unique name for each check-in
        __islocal: 1,
        __unsaved: 1,
        owner: "Administrator",
        log_type: logType,
        // Format the adjusted timestamp as 'YYYY-MM-DD HH:mm:ss'
        time: adjustedTimestamp
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        skip_auto_attendance: row.status5 || 0,
        employee_name: employeeData.employee_name,
        employee: employeeData.employee_id,
        device_id: row.table,
      };

      // Return the formatted data for posting
      return {
        doc: JSON.stringify(doc), // Ensure the doc field is a properly formatted JSON string
        action: "Save",
      };
    });

    return transformedData;
  } catch (error) {
    console.error("Error transforming data:", error);
    return [];
  }
}

// Execute the transformation when the module is run directly
if (require.main === module) {
  (async () => {
    const data = await transformAndMatchData();
    console.log(JSON.stringify(data, null, 2)); // Print transformed data for debugging
  })();
}

module.exports = { transformAndMatchData };
