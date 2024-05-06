import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://adityasoni5353:1234554321@cluster0.zt1z4dm.mongodb.net/",
      {
        dbName: "TodoApp",
      }
    )
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
