import express from "express";
const app = express();

// Custom Middleware Function
const loggerMiddleware = (req, res, next) => {
    console.log(`Request received at: ${new Date().toISOString()}`);
    next(); // Passes the request to the next middleware or route handler
};

// Use Middleware
app.use(loggerMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});

app.get("/dashboard", (req, res) => {
    res.send("This is the dashboard.");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});