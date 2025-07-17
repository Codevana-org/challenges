const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("not pong");
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

module.exports = app;
