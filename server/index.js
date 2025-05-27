import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { router as routes } from "./routes.js";

let PORT = process.env.PORT || 5000;
const app = express();

// db

mongoose.connect("mongodb://localhost:27017/shopping-app", {});

const db = mongoose.connection;
db.on("error", error => console.log(error));
db.once("open", () => console.log("connection to db established"));

// end db

app.use(express.json());
app.use(cors());

app.get("/wade-vishaws", (req, res) => {
    res.send("<h1>Jeevan Shede</h2>")
})

// app.use(express.static("../client"));

app.use('/api', routes);

app.listen(PORT, () => console.log("server on https://localhost:" + PORT))


