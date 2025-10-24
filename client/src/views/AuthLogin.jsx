

"use client"

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LOGIN } from "../graphql/operations.js"
import { toast } from "sonner"

export default function AuthLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
  const [login, { loading, error }] = useMutation(LOGIN)

  async function onSubmit(e) {
    e.preventDefault()
    await login({ variables: form })
    toast.success('Signed in')
    await fetch(window.location.origin + "/graphql", { method: "POST" }).catch(() => {})
    navigate("/")
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/20 flex items-center justify-center px-4 py-12">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Welcome Back</h1>
          <p className="text-lg text-gray-600">Continue your post reading journey</p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={onSubmit}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 space-y-6"
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((v) => ({ ...v, username: e.target.value }))}
              placeholder="yourusername"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all"
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
            >
              {error.message}
            </motion.div>
          )}

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all mt-8"
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center mt-8">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-teal-600 font-semibold hover:text-emerald-600 transition-colors">
              Create one
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
