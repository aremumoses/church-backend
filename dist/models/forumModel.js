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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginatedComments = exports.getPaginatedPosts = exports.deleteComment = exports.updateComment = exports.getCommentsByPost = exports.addComment = exports.getAllPendingPosts = exports.hasUserLikedPost = exports.unlikePost = exports.likePost = exports.deletePost = exports.approvePost = exports.getPostById = exports.getAllApprovedPosts = exports.createPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// ---------------------
// Post Schema
// ---------------------
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: String,
    status: { type: String, enum: ['active', 'pending', 'deleted'], default: 'pending' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const Post = mongoose_1.default.model('Post', postSchema);
// ---------------------
// Like Schema
// ---------------------
const likeSchema = new mongoose_1.default.Schema({
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
});
const PostLike = mongoose_1.default.model('PostLike', likeSchema);
// ---------------------
// Comment Schema
// ---------------------
const commentSchema = new mongoose_1.default.Schema({
    postId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
const Comment = mongoose_1.default.model('Comment', commentSchema);
const createPost = (_a) => __awaiter(void 0, [_a], void 0, function* ({ title, content, category, userId, status }) {
    const post = new Post({ title, content, category, userId, status });
    yield post.save();
    return post;
});
exports.createPost = createPost;
const getAllApprovedPosts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield Post.find({ status: 'active' })
        .sort({ created_at: -1 })
        .populate('userId', 'name');
    const postIds = posts.map((post) => post._id);
    const likes = yield PostLike.find({ postId: { $in: postIds } });
    const likedByUser = yield PostLike.find({ userId, postId: { $in: postIds } });
    return posts.map((post) => {
        var _a;
        const postId = post._id.toString();
        const likeCount = likes.filter((like) => like.postId.toString() === postId).length;
        const liked = likedByUser.some((like) => like.postId.toString() === postId);
        return Object.assign(Object.assign({}, post.toObject()), { like_count: likeCount, liked_by_user: liked, author: ((_a = post.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' });
    });
});
exports.getAllApprovedPosts = getAllApprovedPosts;
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post.findById(id);
});
exports.getPostById = getPostById;
const approvePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Post.findByIdAndUpdate(id, { status: 'active' });
});
exports.approvePost = approvePost;
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield Post.findByIdAndUpdate(id, { status: 'deleted' });
});
exports.deletePost = deletePost;
const likePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield PostLike.create({ postId, userId });
});
exports.likePost = likePost;
const unlikePost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield PostLike.deleteOne({ postId, userId });
});
exports.unlikePost = unlikePost;
const hasUserLikedPost = (postId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const liked = yield PostLike.exists({ postId, userId });
    return !!liked;
});
exports.hasUserLikedPost = hasUserLikedPost;
const getAllPendingPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Post.find({ status: 'pending' }).sort({ created_at: -1 });
});
exports.getAllPendingPosts = getAllPendingPosts;
// ---------------------
// Comments
// ---------------------
const addComment = (postId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = new Comment({ postId, userId, content });
    yield comment.save();
    return comment;
});
exports.addComment = addComment;
const getCommentsByPost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Comment.find({ postId }).sort({ created_at: 1 }).populate('userId', 'name');
});
exports.getCommentsByPost = getCommentsByPost;
const updateComment = (commentId, userId, content) => __awaiter(void 0, void 0, void 0, function* () {
    yield Comment.findOneAndUpdate({ _id: commentId, userId }, { content });
});
exports.updateComment = updateComment;
const deleteComment = (commentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Comment.findOneAndDelete({ _id: commentId, userId });
});
exports.deleteComment = deleteComment;
// ---------------------
// Pagination
// ---------------------
const getPaginatedPosts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [posts, total] = yield Promise.all([
        Post.find({ status: 'active' })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name'),
        Post.countDocuments({ status: 'active' }),
    ]);
    return {
        posts: posts.map((post) => {
            var _a;
            return (Object.assign(Object.assign({}, post.toObject()), { author: ((_a = post.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' }));
        }),
        total,
        page,
        pages: Math.ceil(total / limit),
    };
});
exports.getPaginatedPosts = getPaginatedPosts;
const getPaginatedComments = (postId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [comments, total] = yield Promise.all([
        Comment.find({ postId }).sort({ created_at: 1 }).skip(skip).limit(limit).populate('userId', 'name'),
        Comment.countDocuments({ postId }),
    ]);
    return {
        comments: comments.map((comment) => {
            var _a;
            return (Object.assign(Object.assign({}, comment.toObject()), { author: ((_a = comment.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown' }));
        }),
        total,
        page,
        pages: Math.ceil(total / limit),
    };
});
exports.getPaginatedComments = getPaginatedComments;
