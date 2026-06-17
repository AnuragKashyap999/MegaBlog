import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {

    // Used for page redirection
    const navigate = useNavigate()

    // Store signup errors
    const [error, setError] = useState('')

    // Redux dispatch
    const dispatch = useDispatch()

    // React Hook Form
    const { register, handleSubmit } = useForm()

    // Runs after successful validation
    const create = async (data) => {

        // Clear old errors
        setError('')

        try {

            // Create account in Appwrite
            const userData = await authService.createAccount(data)

            // If account created successfully
            if (userData) {

                // Get current logged in user
                const userData = await authService.getCurrentUser()

                if (userData) {

                    // Save user data in Redux store
                    dispatch(login(userData))
                }

                // Redirect to home page
                navigate('/')
            }

        } catch (error) {

            // Display error message
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center">

            {/* Signup Card */}
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">

                {/* Logo */}
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>

                {/* Login Link */}
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;

                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 mt-8 text-center">
                        {error}
                    </p>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit(create)}>

                    <div className='space-y-5'>

                        {/* Full Name */}
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"

                            {...register("name", {
                                required: true,
                            })}
                        />

                        {/* Email */}
                        <Input
                            label="Email:"
                            placeholder="Enter your email"
                            type="email"

                            {...register("email", {
                                required: true,

                                validate: {
                                    matchPatern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
                                        ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />

                        {/* Password */}
                        <Input
                            label="Password:"
                            type="password"
                            placeholder="Enter your password"

                            {...register("password", {
                                required: true,
                            })}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            Create Account
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
