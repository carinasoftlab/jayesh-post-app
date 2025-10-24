
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { MY_POSTS, UPDATE_POST, DELETE_POST } from "../graphql/operations.js"

export default function DashboardPosts() {
  const { data, loading, error, refetch } = useQuery(MY_POSTS)
  const [updatePost] = useMutation(UPDATE_POST)
  const [deletePost] = useMutation(DELETE_POST)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: "", content: "" })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
      >
        {error.message}
      </motion.div>
    )
  }

  async function startEdit(p) {
    setEditingId(p.id)
    setForm({ title: p.title, content: p.content })
  }

  async function saveEdit() {
    await updatePost({ variables: { id: editingId, ...form } })
    toast.success('Post updated')
    setEditingId(null)
    await refetch()
  }

  async function remove(id) {
    await deletePost({ variables: { id } })
    toast.success('Post deleted')
    await refetch()
  }

  const posts = data?.myPosts ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 mt-8">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
          My <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Posts</span>
        </h1>
        <p className="text-lg text-gray-600">Manage and edit your published posts</p>
        <div className="mt-4 h-1 w-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full"></div>
      </div>

      <AnimatePresence mode="popLayout">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg">You haven't published any posts yet.</p>
          </motion.div>
        ) : (
          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((p, index) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {editingId === p.id ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-0">
                    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                      <div className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl space-y-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-900">Edit Post</h3>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Post Title</label>
                          <input type="text" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Content</label>
                          <textarea value={form.content} onChange={(e) => setForm((v) => ({ ...v, content: e.target.value }))} rows={6} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveEdit} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all">Save Changes</motion.button>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setEditingId(null)} className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Cancel</motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div className="p-8 space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900 leading-tight">{p.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{p.content}</p>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-gray-200">
                      <time className="text-sm text-gray-600 font-medium">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEdit(p)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all text-sm"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => remove(p.id)}
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
