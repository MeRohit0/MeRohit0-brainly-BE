import express from "express";
import "dotenv/config";
import { User } from "./db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET_USER;

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = await User.findOne({
    username,
    password,
  });

  if (query) {
    res.status(403).json({
      data: "You already signup",
    });
  } else {
    await User.create({
      username,
      password,
    });
    res.status(200).json({
      data: "success",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = await User.find({
    username,
    password,
  });

  if (!query) {
    res.status(403).json({
      data: "Invalid Credentials",
    });
  } else {
    const token = jwt.sign({ username: username }, JWT_SECRET!);
    res.status(200).json({
      data: token,
    });
  }
});

app.post("/api/v1/content", (req, res) => {});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(port, async () => {
  await mongoose.connect(`${process.env.DB_KEY}`);
  console.log(`App running on port ${port}`);
});
