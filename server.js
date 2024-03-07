// backend/server.js
import app from "./index.js"; // Adjust the path as necessary
console.log("process.env.APP_PORT", process.env.APP_PORT);
const port = process.env.APP_PORT || 6000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Express Server started on port ${port}`)
);
