import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchData, createData, updateData, deleteData } from "../services/apiService";

// Interface for Posts
interface Post {
  id: number;
  title: string;
  body: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchData<{ posts: Post[] }>("posts");
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;

    const tempId = Date.now();
    const newPost: Post = { id: tempId, title: newTitle, body: newBody };

    setPosts((prev) => [newPost, ...prev]);
    setNewTitle("");
    setNewBody("");

    try {
      const postFromAPI = await createData<Post>("posts/add", {
        title: newTitle,
        body: newBody,
        userId: 1,
      });

      setPosts((prev) =>
        prev.map((post) => (post.id === tempId ? { ...post, id: postFromAPI.id } : post))
      );
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const updatePost = async (id: number, title: string, body: string) => {
    const updatedTitle = prompt("Edit title:", title);
    const updatedBody = prompt("Edit body:", body);

    if (!updatedTitle || !updatedBody) return;

    const oldPosts = [...posts];

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, title: updatedTitle, body: updatedBody } : post
      )
    );

    try {
      await updateData<Post>("posts", id, { title: updatedTitle, body: updatedBody });
    } catch (error) {
      console.error("Failed to update post:", error);
      setPosts(oldPosts);
    }
  };

  const removePost = async (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));

    try {
      await deleteData("posts", id);
    } catch (error) {
      console.error("Failed to delete post:", error);
      const data = await fetchData<{ posts: Post[] }>("posts");
      setPosts(data.posts);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-900 p-6 pt-24">
      <motion.h2
        className="text-4xl md:text-6xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Posts
      </motion.h2>

      <div className="max-w-xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2"
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Enter post body"
            className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2"
          />
          <motion.button
            onClick={addPost}
            className="w-full bg-blue-500 text-white py-2 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Post
          </motion.button>
        </motion.div>

        <div className="overflow-y-auto max-h-[60vh] w-full">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="flex flex-col bg-gray-700 text-white p-3 rounded shadow mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-300">{post.body}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <motion.button
                    onClick={() => updatePost(post.id, post.title, post.body)}
                    className="text-yellow-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✎
                  </motion.button>
                  <motion.button
                    onClick={() => removePost(post.id)}
                    className="text-red-400"
                    whileHover={{ scale: 1.2 }}
                  >
                    ✖
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Posts;