import { useQuery } from '@apollo/client'
import { Navigate } from 'react-router-dom'
import { ME } from '../../graphql/operations.js'

export default function AuthGate({ children }) {
  const { data, loading } = useQuery(ME, { fetchPolicy: 'cache-and-network' })
  if (loading) return <div className="text-slate-400">Loading...</div>
  if (!data?.me) return <Navigate to="/login" replace />
  return children
}


