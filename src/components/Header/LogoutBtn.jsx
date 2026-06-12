import React from 'react'
import { useDispatch } from 'react-redux'

import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {

    // Redux dispatch function
    const dispatch = useDispatch()

    // Handles user logout
    const logoutHandler = () => {

        // Remove user session from Appwrite
        authService.logOut()
            .then(() => {

                // Clear user data from Redux store
                dispatch(logout())

            })
    }

    return (
        <button
            className='inline-block px-6 py-2 duration-200
            hover:bg-blue-100 rounded-full'

            // Run logout function when button is clicked
            onClick={logoutHandler}
        >
            Logout
        </button>
    )
}
export default LogoutBtn;