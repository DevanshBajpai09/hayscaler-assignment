import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, allowedRole }) {

  const user = JSON.parse(localStorage.getItem("user"))

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // wrong role
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />
  }

  return children
}