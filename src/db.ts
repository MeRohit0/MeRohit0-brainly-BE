import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

// schema and data model for mongoose 

const userSchema = new Schema({
  username: { type: String, required: true , unique:true },
  password: { type: String, required: true },
});

const contentSchema = new Schema({
  link: { type: String },
  type: { type: String },
  title: { type: String },
  tags: [{ type: ObjectId , ref: "Tag"}],
  userId: { type: ObjectId, ref: "User" , required : true},
});

const tagsSchema = new Schema({
  title: { type: String },
});

const linkSchema = new Schema({
  hash: { type: String , unique: true},
  userId: { type: ObjectId, ref: "User" },
});

export const User = mongoose.model("User", userSchema);
export const Content = mongoose.model("Content", contentSchema);
export const Tag = mongoose.model("Tag", tagsSchema);
export const Link = mongoose.model("Link", linkSchema);
