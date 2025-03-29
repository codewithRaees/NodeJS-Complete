import express from "express";

const app = express();
const port = 4000;


app.get("/", (req, res) => {
  // res.setHeader('Content-Type', 'application/json');
  // res.end(JSON.stringify({"name": "John Doe", "age": 30}));
  res.json({"name": "John Doe", "age": 30});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
