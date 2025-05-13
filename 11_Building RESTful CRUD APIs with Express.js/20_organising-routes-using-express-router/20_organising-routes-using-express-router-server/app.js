import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js"
import filesRoutes from "./routes/filesRoutes.js"

const app = express();

app.use(express.json());
app.use(cors());

app.use('/directory', directoryRoutes)
app.use('/files', filesRoutes)


app.listen(4001, () => {
  console.log(`Server Started`);
});
