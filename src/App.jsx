import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import { login, logout } from "./store/authSlice"
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  // loading state prevents UI from rendering
  // until authentication status is checked
  const [loading, setLoading] = useState(true)

  // Redux dispatch function
  const dispatch = useDispatch();

  useEffect(() => {

    // Check if user is already logged in
    authService.getCurrentUser()

      .then((userData) => {

        // If user data exists, save it in Redux store
        if (userData) {
          dispatch(login({ userData }))
        }

        // If no user found, remove auth state
        else {
          dispatch(logout())
        }
      })

      // Runs whether promise succeeds or fails
      .finally(() => setLoading(false))

  }, []) // Empty dependency array => runs only once when component mounts

  return !loading ? (
    <div
      className='min-h-screen flex flex-wrap
      content-between bg-gray-400'
    >
      <div>

        {/* Top Navigation */}
        <Header />

        {/* Main Page Content */}
        <main>

          {/* React Router Outlet will render pages here */}
          Todo : <Outlet />

        </main>

        {/* Footer Section */}
        <Footer />

      </div>
    </div>
  ) : null // Don't render anything while authentication is being checked
}

export default App