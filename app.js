import express from "express";
import multer from "multer";
import { dbConnection } from "./database/dbConnection.js";
import todoRouter from "./router/todoRouter.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

// Middleware
app.use(express.json());
const upload = multer({ dest: "uploads/fils" });

// Routes
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Todo routes
app.use("/todos", todoRouter(upload));

// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

export default app;
