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
  router.get("/", fetchAllTodos);
  router.get("/:id", singleTodo);
  router.post("/", addTodo);
  router.put("/:id", updateTodo);
  router.delete("/:id", deleteTodo);
  router.get("/todos/filter", filterTodosByStatus);
  router.post("/upload", upload.single("file"), uploadCSV);
  router.get("/download", downloadCSV);

  return router;
};

export default todoRouter;
