import PostMessage from '../models/PostMessage.js';
import mongoose from 'mongoose';


export const getPost = async(req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPosts = async(req, res) => {
    try {
        const postMessage = await PostMessage.find();
        res.status(200).json(postMessage);
    } catch (e) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json({ posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const createPost = async(req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() })
    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async(req, res) => {
    const { id: _id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send(`No post with id: ${_id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: _id };

    await PostMessage.findByIdAndUpdate(_id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async(req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async(req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: " Unauthenticated" });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));


    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}