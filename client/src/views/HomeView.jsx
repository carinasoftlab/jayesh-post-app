// import { motion } from "framer-motion"
// import { Link } from 'react-router-dom'
// import { useQuery } from '@apollo/client'
// import { ME } from '../graphql/operations.js'
// import ComposeDialog from '../ui/components/ComposeDialog.jsx'
// import PostGrid from '../ui/components/PostGrid.jsx'

// export default function HomeView() {
//   const { data } = useQuery(ME, { fetchPolicy: "cache-and-network" })
//   const isAuthed = !!data?.me

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
//   }

//   const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-50/40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Discover and Share</h1>
//           <p className="mt-3 text-slate-600">A refreshed, card-first reading experience</p>
//         </motion.div>

//         <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid lg:grid-cols-3 gap-8">
//           <motion.div variants={itemVariants} className="lg:col-span-1">
//             <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
//               <h2 className="text-2xl font-serif font-bold text-indigo-600 mb-6">Compose</h2>
//               {isAuthed ? (
//                 <ComposeDialog />
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
//                   <p className="text-slate-600 leading-relaxed">Sign in to share your thoughts and connect with our community.</p>
//                   <div className="space-y-3">
//                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                       <Link to="/login" className="block w-full px-4 py-3 text-center rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200 transition-colors">Sign In</Link>
//                     </motion.div>
//                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                       <Link to="/register" className="block w-full px-4 py-3 text-center rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">Create Account</Link>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               )}
//             </div>
//           </motion.div>

//           <motion.div variants={itemVariants} className="lg:col-span-2">
//             <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
//               <h2 className="text-2xl font-serif font-bold text-indigo-600 mb-6">Latest Stories</h2>
//               <PostGrid />
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }


"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { ME } from "../graphql/operations.js"
import ComposeDialog from "../ui/components/ComposeDialog.jsx"
import PostGrid from "../ui/components/PostGrid.jsx"

export default function HomeView() {
  const { data } = useQuery(ME, { fetchPolicy: "cache-and-network" })
  const isAuthed = !!data?.me

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Share Your <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Posts</span>
          </h1>
        
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Publish?</h2>
              {isAuthed ? (
                <ComposeDialog />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Sign in to share your thoughts and connect with our community.
                  </p>
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/login"
                        className="block w-full px-4 py-3 text-center rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/register"
                        className="block w-full px-4 py-3 text-center rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all"
                      >
                        Create Account
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Latest Posts</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full mb-6" />
              <PostGrid />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
