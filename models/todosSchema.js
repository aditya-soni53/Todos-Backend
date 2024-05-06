import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  TodoItem: {
    type: Number,
    required: [true, "Please enter a TodoItem"],
    unique: [true, "Number must be unique"],
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
    minlength: [5, "Description must be at least 5 characters"],
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: function () {
      return this.status || "Pending";
    },
  },
});

export const Todo = mongoose.model("Todo", todoSchema);
