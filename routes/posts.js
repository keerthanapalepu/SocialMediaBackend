import express from 'express';
import { getPost, getPosts, getPostsBySearch, createPost, updatePost, deletePost, likePost } from '../controller/posts.js';
import auth from '../middleware/auth.js';
const router = express.Router();


router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
export default router;