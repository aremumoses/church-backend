"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeComment = exports.editComment = exports.getPostComments = exports.createComment = exports.getPendingPosts = exports.likeForumPost = exports.deleteForumPost = exports.approveForumPost = exports.getApprovedPosts = exports.createForumPost = void 0;
const forumModel_1 = require("../models/forumModel");
const createForumPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, category } = req.body;
    const userId = (req.user.id);
    const role = req.user.role;
    const status = role === 'admin' || role === 'superadmin' ? 'active' : 'pending';
    const post = yield (0, forumModel_1.createPost)({ title, content, category, userId, status });
    res.status(201).json(post);
});
exports.createForumPost = createForumPost;
const getApprovedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    if (isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ message: 'Page and limit must be numbers' });
    }
    try {
        console.log('Getting posts with:', { page, limit });
        const data = yield (0, forumModel_1.getPaginatedPosts)(page, limit);
        res.json(data);
    }
    catch (err) {
        console.error('Pagination error:', err);
        res.status(500).json({ message: 'Server error while paginating posts' });
    }
});
exports.getApprovedPosts = getApprovedPosts;
const approveForumPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, forumModel_1.approvePost)(id);
    res.json({ message: 'Post approved' });
});
exports.approveForumPost = approveForumPost;
const deleteForumPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, forumModel_1.deletePost)(id);
    res.json({ message: 'Post deleted' });
});
exports.deleteForumPost = deleteForumPost;
const likeForumPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = (req.params.id);
    const userId = (req.user.id);
    const liked = yield (0, forumModel_1.hasUserLikedPost)(postId, userId);
    if (liked) {
        yield (0, forumModel_1.unlikePost)(postId, userId);
        return res.json({ message: 'Post unliked' });
    }
    yield (0, forumModel_1.likePost)(postId, userId);
    return res.json({ message: 'Post liked' });
});
exports.likeForumPost = likeForumPost;
const forumModel_2 = require("../models/forumModel"); // make sure it's imported
const getPendingPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = req.user.role;
    if (role !== 'admin' && role !== 'superadmin') {
        return res.status(403).json({ message: 'Access denied. Only admin or superadmin can view pending posts.' });
    }
    const posts = yield (0, forumModel_2.getAllPendingPosts)();
    res.json(posts);
});
exports.getPendingPosts = getPendingPosts;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = (req.params.postId);
    const { content } = req.body;
    const userId = (req.user.id);
    const comment = yield (0, forumModel_1.addComment)(postId, userId, content);
    res.status(201).json(comment);
});
exports.createComment = createComment;
const getPostComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = (req.params.postId);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    if ((!postId) || isNaN(page) || isNaN(limit)) {
        return res.status(400).json({ message: 'Invalid query parameters' });
    }
    try {
        const data = yield (0, forumModel_1.getPaginatedComments)(postId, page, limit);
        res.json(data);
    }
    catch (err) {
        console.error('Pagination error (comments):', err);
        res.status(500).json({ message: 'Server error while paginating comments' });
    }
});
exports.getPostComments = getPostComments;
const editComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = (req.params.commentId);
    const { content } = req.body;
    //    const postId =  (req.params.id);
    const userId = (req.user.id);
    yield (0, forumModel_1.updateComment)(commentId, userId, content);
    res.json({ message: 'Comment updated' });
});
exports.editComment = editComment;
const removeComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = (req.params.commentId);
    const userId = (req.user.id);
    yield (0, forumModel_1.deleteComment)(commentId, userId);
    res.json({ message: 'Comment deleted' });
});
exports.removeComment = removeComment;
