import express from "express";
import {
  addTodo,
  deleteTodo,
  fetchAllTodos,
  filterTodosByStatus,
  singleTodo,
  updateTodo,
  uploadCSV,
  downloadCSV,
} from "../controller/todoController.js";

const router = express.Router();

const todoRouter = (upload) => {
  router.get("/all", fetchAllTodos);
  router.get("/one/:id", singleTodo);
  router.post("/add", addTodo);
  router.put("/update/:id", updateTodo);
  router.delete("/delete/:id", deleteTodo);
  router.get("/filter", filterTodosByStatus);
  router.post("/upload", upload.single("file"), uploadCSV);
  router.get("/download", downloadCSV);

  return router;
};

export default todoRouter;
