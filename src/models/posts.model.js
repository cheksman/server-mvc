const mongoose = require("mongoose");

const { Schema } = mongoose;

const postsModel = new Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    excerpt: {
      type: String,
    },
    title: {
        type: String,
    },
    featuredImage: {
        type: String
    },
    categories: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    post: {
        type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("posts", postsModel);
