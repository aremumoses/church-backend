import db from "../config/db";


export interface CreatePostInput {
  title: string;
  content: string;
  category?: string;
  userId: number;
  status: 'active' | 'pending';
}
export const createPost = async ({ title, content, category, userId, status }: CreatePostInput) => {
  const sql = 'INSERT INTO posts (title, content, category, user_id, status) VALUES (?, ?, ?, ?, ?)';
  const [result]: any = await db.execute(sql, [title, content, category, userId, status]);
  return { id: result.insertId, title, content, category, userId, status };
};

// export const getAllApprovedPosts = async () => {
//   const [rows] = await db.execute(
//     `SELECT posts.*, users.name AS author 
//      FROM posts JOIN users ON posts.user_id = users.id 
//      WHERE posts.status = 'active'
//      ORDER BY posts.created_at DESC`
//   );
//   return rows;
// };

export const getAllApprovedPosts = async (userId: number) => {
  const [rows] = await db.execute(`
    SELECT 
      posts.*,
      users.name AS author,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) AS like_count,
      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_id = posts.id AND user_id = ?
      ) AS liked_by_user
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.status = 'active'
    ORDER BY posts.created_at DESC
  `, [userId]);

  return rows;
};

export const getPostById = async (id: number) => {
  const [rows] = await db.execute('SELECT * FROM posts WHERE id = ?', [id]);
  return (rows as any[])[0];
};

export const approvePost = async (id: string) => {
  await db.execute('UPDATE posts SET status = "active" WHERE id = ?', [id]);
};

export const deletePost = async (id: string) => {
  await db.execute('UPDATE posts SET status = "deleted" WHERE id = ?', [id]);
};

export const likePost = async (postId: number, userId: number) => {
  await db.execute('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
};

export const unlikePost = async (postId: number, userId: number) => {
  await db.execute('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
};

export const hasUserLikedPost = async (postId: number, userId: number): Promise<boolean> => {
  const [rows] = await db.execute('SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
  return (rows as any[]).length > 0;
};

export const getAllPendingPosts = async () => {
  const sql = 'SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC';
  const [rows]: any = await db.execute(sql, ['pending']);
  return rows;
};

 
export const getAllApprovedPostsWithLikeInfo = async (userId: number) => {
  const [rows] = await db.execute(`
    SELECT 
      posts.*,
      users.name AS author,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) AS like_count,
      EXISTS(
        SELECT 1 FROM post_likes WHERE post_id = posts.id AND user_id = ?
      ) AS liked_by_user
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.status = 'active'
    ORDER BY posts.created_at DESC
  `, [userId]);

  return rows;
};


export const addComment = async (postId: number, userId: number, content: string) => {
  const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  const [result]: any = await db.execute(sql, [postId, userId, content]);
  return { id: result.insertId, postId, userId, content };
};

export const getCommentsByPost = async (postId: number) => {
  const [rows] = await db.execute(
    `SELECT comments.*, users.name AS author 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE post_id = ? 
     ORDER BY created_at ASC`,
    [postId]
  );
  return rows;
};

export const updateComment = async (commentId: number, userId: number, content: string) => {
  const sql = 'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?';
  await db.execute(sql, [content, commentId, userId]);
};

export const deleteComment = async (commentId: number, userId: number) => {
  const sql = 'DELETE FROM comments WHERE id = ? AND user_id = ?';
  await db.execute(sql, [commentId, userId]);
};


export const getPaginatedPosts = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  console.log('Running SQL with:', { limit, offset });

  const [rows] = await db.query(
    `SELECT posts.*, users.name AS author 
     FROM posts 
     JOIN users ON posts.user_id = users.id 
     WHERE posts.status = 'active' 
     ORDER BY posts.created_at DESC 
     LIMIT ${limit} OFFSET ${offset}`
  );

  const [countResult]: any = await db.execute(
    `SELECT COUNT(*) as total FROM posts WHERE status = 'active'`
  );

  return {
    posts: rows,
    total: countResult[0].total,
    page,
    pages: Math.ceil(countResult[0].total / limit),
  };
};


export const getPaginatedComments = async (postId: number, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  console.log('Running comment SQL with:', { postId, limit, offset });

  const [rows] = await db.query(
    `SELECT comments.*, users.name AS author 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE comments.post_id = ? 
     ORDER BY comments.created_at ASC 
     LIMIT ${limit} OFFSET ${offset}`,
    [postId]
  );

  const [countResult]: any = await db.execute(
    `SELECT COUNT(*) as total FROM comments WHERE post_id = ?`,
    [postId]
  );

  return {
    comments: rows,
    total: countResult[0].total,
    page,
    pages: Math.ceil(countResult[0].total / limit),
  };
};
