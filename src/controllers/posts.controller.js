import {
  addPostsService,
  getAllPostsService,
  getPostByIdService,
  getPostsByCategoryService,
} from "../services/posts.services";
import { uploadFile } from "../utils/uploader"


// for adding a post
const addPost = async (req, res, next) => {
  const { values } = req.body;
  const reqVal = JSON.parse(values);

  // get the file added by the user
  const imageFile = req.files.file;
  
  try {
    // upload the image to cloudinary
    const featuredImage = await uploadFile(imageFile, "image", "blog");
    
    // call the addPostsService mentioned to process all the values
    await addPostsService(reqVal, req, res, next, featuredImage)
  } catch (error) {
    next({
      message: "Failed to add Post",
      err: error,
    });
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const allPosts = await getAllPostsService();
    if (!allPosts)
      return res.status(404).json({
        message: "Could not find posts",
      });
    return res.status(200).json({
      message: "Successful",
      data: allPosts,
    });
  } catch (error) {
    next({
      message: "Failed to add Post",
      err: error,
    });
  }
};

const getPostsById = async (req, res, next) => {
  const { postId } = req.params;
  try {
      const singlePost = await getPostByIdService(postId);
      if (!singlePost)
        return res.status(404).json({
          message: "Could not find post",
        });
      return res.status(200).json({
        message: "Successful",
        data: singlePost,
      });
  } catch (error) {
    next({
      message: "Failed to add Post",
      err: error,
    });
  }
};

export {addPost, getAllPosts, getPostsById}