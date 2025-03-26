import express from "express";

const app = express();
const port = 4000;

// app.use("/", (req, res , next) => {
//   console.log(req.headers)
//  console.log("Hiiii")
//  res.send("Middle Ware Running")
// })

app.get("/", (req, res) => {
  console.log(req.url)
  console.log(req.headers)
  res.send("Home is running")
})
app.get("/login", (req, res) => {
  console.log(req.url)
  console.log(req.headers)
  res.send("Login is running")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
