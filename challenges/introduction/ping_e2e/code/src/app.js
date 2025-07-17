const express = require("express");
const app = express();

app.get("/ping", (req, res) => {
  res.send("not pong");
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port " + PORT);
  });
}

module.exports = app;
