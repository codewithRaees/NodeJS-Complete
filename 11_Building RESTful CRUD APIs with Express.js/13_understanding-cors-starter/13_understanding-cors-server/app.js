import express from "express";

const app = express();
const PORT = 4000;
app.use(express.static('public'))
app.use((req, res , next) => {
  const alloworigin = ['http://127.0.0.1:5500', 'http://127.0.0.100:5500', 'http://127.0.0.99:5500']
  if(alloworigin.includes(req.headers.origin)) {
    res.set('Access-Control-Allow-Origin', req.headers.origin)
  }
  next()
})

app.get("/api", (req, res) => {
  res.json({ message: "Hello, world get!" });
});

app.post("/api", (req, res) => {
  res.json({ message: "Hello, world post!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
