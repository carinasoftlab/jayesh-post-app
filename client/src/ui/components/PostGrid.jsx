

import { useQuery } from "@apollo/client"
import { motion } from "framer-motion"
import { GET_POSTS } from "../../graphql/operations.js"

export default function PostGrid() {
  const { data, loading, error } = useQuery(GET_POSTS)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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

  const posts = data?.posts ?? []

  if (posts.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <p className="text-gray-600 text-lg">No posts yet. Be the first to share!</p>
      </motion.div>
    )
  }

  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, index) => (
        <motion.li
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-teal-200 transition-all overflow-hidden"
        >
          <div className="p-6 space-y-3">
            <div className="h-1 w-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full group-hover:w-full transition-all duration-300" />
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
              {post.title}
            </h3>
            {post.author && (
              <p className="text-sm text-gray-600 font-medium">@{post.author.username}</p>
            )}
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{post.content}</p>
          </div>
          <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 border-t border-gray-200">
            <time className="text-xs text-gray-600 font-medium">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
           
          </div>
        </motion.li>
      ))}
    </motion.ul>
  )
}
