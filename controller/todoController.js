import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Todo } from "../models/todosSchema.js";
import csvParser from "csv-parser";
import fs from "fs";

export const fetchAllTodos = catchAsyncErrors(async (req, res, next) => {
  const todos = await Todo.find();

  res.status(200).json({
    success: true,
    todos,
  });
});

export const addTodo = catchAsyncErrors(async (req, res, next) => {
  const { TodoItem, description } = req.body;

  if (!TodoItem || !description) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const todo = await Todo.create({
    TodoItem,
    description,
  });
  res.status(200).json({
    success: true,
    todo,
  });
});

export const deleteTodo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const todo = await Todo.findById(id);
  if (!todo) {
    return next(new ErrorHandler("Todo not found", 404));
  }

  await Todo.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
  });
});

export const singleTodo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!todo) {
    return next(new ErrorHandler("Todo not found", 404));
  }

  res.status(200).json({
    success: true,
    todo,
  });
});

export const updateTodo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { description, status } = req.body;
  const todo = await Todo.findById(id);
  if (!todo) {
    return next(new ErrorHandler("Todo not found", 404));
  }
  if (!description && !status) {
    return next(
      new ErrorHandler("Please enter description and status fields", 400)
    );
  }

  todo.description = description || todo.description;
  todo.status = status || todo.status;
  const updatedTodo = await todo.save();
  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    updatedTodo,
  });
});

export const filterTodosByStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.query;

  const todos = await Todo.find({ status });
  if (!todos) {
    return next(new ErrorHandler("No todos found", 404));
  }
  res.status(200).json({
    success: true,
    todos,
  });
});

export const uploadCSV = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorHandler("No file uploaded", 400));
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await Todo.insertMany(results);
        res.status(200).json({
          success: true,
          message: "Todo items uploaded successfully",
        });
      } catch (error) {
        next(new ErrorHandler("Error uploading todo items", 500));
      }
    });
});

export const downloadCSV = catchAsyncErrors(async (req, res, next) => {
  try {
    const todos = await Todo.find();
    const csvData = todos.map((todo) => ({
      TodoItem: todo.TodoItem,
      description: todo.description,
      status: todo.status,
    }));

    const csvRows = csvData.map(
      (todo) => `${todo.TodoItem},${todo.description},${todo.status}`
    );
    const csvContent = csvRows.join("\n");

    res.setHeader("Content-Disposition", "attachment; filename=todoList.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(csvContent);
  } catch (error) {
    next(new ErrorHandler("Error downloading todo list", 500));
  }
});
