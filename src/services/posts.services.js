import postsModel from "../models/posts.model";

const addPostsService = async (reqVal, req, res, next, featuredImage) => {
  const { categories, tags, title, excerpt, post } = reqVal;
  const { userId } = req.userData;
  try {
    const newPost = await postsModel.create({
      categories: categories,
      tags: tags,
      featuredImage: featuredImage.secure_url,
      title: title,
      excerpt: excerpt,
      post: post,
      author: userId,
    });

    if (!newPost) {
      return res.status(500).json({
        message: "Failed to add post",
      });
    }
    return res.status(200).json({
      message: "Successful",
      data: newPost,
    });
  } catch (error) {
    next({
      message: "Failed to add Post",
      err: error,
    });
  }
};

const getAllPostsService = async () => {
    return await postsModel.find({}).limit(5).sort("-1").lean().exec()
}

const getPostByIdService = async (id) => {
    return await postsModel.findById(id).lean().exec()
}

const getPostsByCategoryService = async (category) => {
    return await postsModel.find({categories: category}).lean().exec()
}

export {addPostsService, getAllPostsService, getPostByIdService, getPostsByCategoryService}