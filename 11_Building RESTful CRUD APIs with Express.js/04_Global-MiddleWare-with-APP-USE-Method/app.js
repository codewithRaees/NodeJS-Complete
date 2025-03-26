import express from 'express';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Global MiddleWare ....   Request received at: ${new Date().toISOString()}`);
    next(); // Passes the request to the next middleware or route handler
});

app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});
app.get('/data', (req, res) => {
    console.log(req.query)
    res.json({ message: "JSON received", data: req.query });
    
})
app.post('/test', (req, res) => {
    console.log("Received Data:", req.body);
    res.json({ message: "Success", received: req.body });
});

app.get("/login", (req, res) => {
    res.send("This is the dashboard.");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

