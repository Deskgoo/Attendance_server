const fs = require("fs");
const path = require("path");
const { extractData } = require("./extractData");

const EMPLOYEE_MAPPING_PATH = path.join(__dirname, "../data/employeeMap.json");

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

async function transformAndMatchData() {
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

  const transformedData = mysqlData.map((row) => {
    const logType = row.status1 === 0 ? "NI" : "OUT";
    const employeeData = employeeMap[row.employee_id] || {
      employee_id: "Unknown",
      employee_name: "Unknown",
    };

    const doc = {
      docstatus: 0,
      doctype: "Employee Checkin",
      name: `new-employee-checkin-${row.id}`,
      __islocal: 1,
      __unsaved: 1,
      owner: "Administrator",
      log_type: logType,
      time: row.timestamp,
      skip_auto_attendance: row.status5 || 0,
      employee_name: employeeData.employee_name,
      employee: employeeData.employee_id,
      device_id: row.table,
    };

    return {
      doc: JSON.stringify(doc),
      action: "Save",
    };
  });

  return transformedData;
}

if (require.main === module) {
  (async () => {
    const data = await transformAndMatchData();
    console.log(JSON.stringify(data, null, 2)); // Print transformed data for debugging
  })();
}

module.exports = { transformAndMatchData };
