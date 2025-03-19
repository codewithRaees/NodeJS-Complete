import express from "express";

const app = express()
app.disable("x-powered-by")
app.get("/", (req, res) => {
    res.send("Hello World Raees")

    // res.setHeader("Content-Type", "text/html")
    // res.end("Hello World")
})


app.listen(
    3000,
    () => console.log("Server running on port 3000")
)