const express = require("express");
const employeeRoutes = require("./data/route/employeeAddroute");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
