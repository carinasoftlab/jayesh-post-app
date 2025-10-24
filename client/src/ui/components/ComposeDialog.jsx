
import { useState } from "react"
import { useMutation } from "@apollo/client"
import { motion, AnimatePresence } from "framer-motion"
import { ADD_POST, GET_POSTS, MY_POSTS } from "../../graphql/operations.js"
import { toast } from "sonner"

export default function ComposeDialog() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [open, setOpen] = useState(false)
  const [addPost, { loading }] = useMutation(ADD_POST, {
    update(cache, { data }) {
      const newPost = data?.addPost
      if (!newPost) return
      const existing = cache.readQuery({ query: GET_POSTS })
      cache.writeQuery({ query: GET_POSTS, data: { posts: [newPost, ...(existing?.posts ?? [])] } })
      try {
        const myExisting = cache.readQuery({ query: MY_POSTS })
        cache.writeQuery({ query: MY_POSTS, data: { myPosts: [newPost, ...(myExisting?.myPosts ?? [])] } })
      } catch {}
    },
    onCompleted: () => toast.success('Post published'),
    onError: (e) => toast.error(e.message || 'Failed to publish'),
  })

  async function onSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    await addPost({ variables: { title: title.trim(), content: content.trim() } })
    setTitle("")
    setContent("")
    setOpen(false)
  }

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all"
      >
         Create a New Post
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.form
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onSubmit={onSubmit}
              className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Share Your Post</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Post Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your post a captivating title..."
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-600 text-right font-medium">
                  {title.length}
                  <span className="text-gray-400">/120</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts, ideas, and posts here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !title.trim() || !content.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Publishing..." : "Publish Post"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
