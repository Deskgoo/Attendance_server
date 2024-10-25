const express = require("express");
const employeeRoutes = require("./data/route/employeeAddroute"); // Adjust the path accordingly

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(employeeRoutes); // Use the employee routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
