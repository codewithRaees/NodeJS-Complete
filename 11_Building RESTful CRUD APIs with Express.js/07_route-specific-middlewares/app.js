import express from "express";

const app = express();
const port = 4000;

app.use("/users/1", (req, res, next) => {
  res.send("2nd middleware");
});

app.use("/users", (req, res, next) => {
  console.log(req.url)
  res.send("First middleware");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
