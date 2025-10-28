

"use client"

import { useMutation, useQuery } from "@apollo/client"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LOGOUT, ME } from "../../graphql/operations.js"
import { toast } from "sonner"

export default function Topbar() {
  const { data, refetch } = useQuery(ME, { fetchPolicy: "cache-and-network" })
  const [logoutMutation] = useMutation(LOGOUT)
  const navigate = useNavigate()
  const user = data?.me

  async function logout() {
    await logoutMutation()
    await refetch()
    toast.success('Signed out')
    navigate("/")
  }

  const navItems = [{ label: "Home", href: "/" }, ...(user ? [{ label: "My Posts", href: "/me" }] : [])]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-blue-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"
            >
              Narrativ
            </motion.div>
          </Link> */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-gray-700 hover:text-blue-400 font-medium transition-colors relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-gray-700 text-sm font-medium">
                @{user.username}
              </span>
            )}
            {!user ? (
              <>
                <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-400 font-medium transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {/* <Link
                    to="/register"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
                  >
                    Register
                  </Link> */}
                </motion.div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all"
              >
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
