const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Add new employee data
router.post("/addEmployee", (req, res) => {
  const newEmployees = Array.isArray(req.body) ? req.body : [req.body];

  const filePath = path.join(__dirname, "employeeMap.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    let employees = JSON.parse(data);
    let addedEmployees = [];
    let skippedEmployees = [];

    newEmployees.forEach((newEmployee) => {
      const exists = employees.some(
        (emp) => emp.device_employee_id === newEmployee.device_employee_id
      );

      if (exists) {
        // If the employee already exists, skip
        skippedEmployees.push(newEmployee);
      } else {
        // If employee doesn't exist, add to the list
        employees.push(newEmployee);
        addedEmployees.push(newEmployee);
      }
    });

    if (addedEmployees.length > 0) {
      fs.writeFile(
        filePath,
        JSON.stringify(employees, null, 2),
        "utf8",
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Error writing file" });
          }
          res.status(201).json({
            message: "Employees processed successfully",
            added: addedEmployees,
            skipped: skippedEmployees,
          });
        }
      );
    } else {
      res.status(200).json({
        message: "No new employees added; all employees already exist",
        skipped: skippedEmployees,
      });
    }
  });
});

module.exports = router;
