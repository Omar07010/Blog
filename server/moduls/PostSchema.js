import mongoose from "mongoose";
const Schema = mongoose.Schema;


const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema
const Post = mongoose.model('Post', postSchema);

export default Post;
