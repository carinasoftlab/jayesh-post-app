import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, useQuery } from '@apollo/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Topbar from './ui/components/Topbar.jsx'
import HomeView from './views/HomeView.jsx'
import AuthLogin from './views/AuthLogin.jsx'
import AuthRegister from './views/AuthRegister.jsx'
import DashboardPosts from './views/DashboardPosts.jsx'
import { ME } from './graphql/operations.js'

export default function App() {
  const uri = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql'
  const client = useMemo(() => new ApolloClient({
    link: new HttpLink({ uri, credentials: 'include' }),
    cache: new InMemoryCache()
  }), [uri])

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="">
          <Topbar />
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/login" element={<AuthLogin />} />
            <Route path="/register" element={<AuthRegister />} />
            <Route path="/me" element={<RequireAuth><DashboardPosts /></RequireAuth>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

function RequireAuth({ children }) {
  const { data, loading } = useQuery(ME, { fetchPolicy: 'cache-and-network' })
  if (loading) return <div className="text-slate-400">Loading...</div>
  if (!data?.me) return <Navigate to="/login" replace />
  return children
}



