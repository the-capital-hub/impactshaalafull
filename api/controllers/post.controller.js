import Post from "../modals/post.modal.js";
import { s3 } from "../utils/awsConfig.js";

const createPost = async (req, res) => {
  try {
    if (req.body.isAdmin) {
      req.body.status = "active";
    } else {
      req.body.status = "pending";
    }

    if (req.file) {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${req.file.originalname}`;
      const params = {
        Bucket: "impactshaaladocuments",
        Key: `documents/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const res = await s3.upload(params).promise();
      req.body.attachmentUrl = res.Location;
      delete req.body.attachment;
    }
    const newPost = new Post({
      ...req.body,
    });
    await newPost.save();
    res.status(200).send(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getPostByUser = async (req, res) => {
  try {
    const post = await Post.find({ createdById: req.params.id });
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find({ status: "active" }).sort({ createdAt: -1 });
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getSomePosts = async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send(err);
  }
};

const approvePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.postId, {
      status: "active",
    });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    return res.status(200).send({ message: "Post approved successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const getPendingPosts = async (req, res) => {
  try {
    const pendingPosts = await Post.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).send(pendingPosts);
  } catch (err) {
    console.log(err);
    res.status.send(err);
  }
};

export {
  createPost,
  getPostByUser,
  getAllPosts,
  getSomePosts,
  getSinglePost,
  approvePost,
};
