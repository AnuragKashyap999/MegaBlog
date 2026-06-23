import react, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { useForm } from 'react-hook-form'

function Login() {
    // Redux dispatch function
    const dispatch = useDispatch()

    // Used for page navigation after login
    const navigate = useNavigate()

    // register -> connects inputs to react-hook-form
    // handleSubmit -> validates form before submitting
    const { register, handleSubmit } = useForm()

    // Store login errors
    const [error, setError] = useState('')

    // Login function runs after successful validation
    const login = async (data) => {

        // Clear previous errors
        setError('')

        try {

            // Send email + password to Appwrite
            const session = await authService.login(data)

            // If login successful
            if (session) {

                // Fetch current user details
                const userdata = await authService.getCurrentUser()

                if (userdata) {

                    // Save user data in Redux store
                    dispatch(authLogin(userdata))
                }

                // Redirect to Home page
                navigate('/')
            }

        } catch (error) {

            // Show login error
            setError(error.message)
        }
    }

    return (
        <div className='flex items-center justify-center w-full'>

            {/* Login Card */}
            <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>

                {/* Logo Section */}
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign in to your account
                </h2>

                {/* Signup Link */}
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;

                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {/* Error Message */}
                {error && (
                    <p className="text-red-600 mt-8 text-center">
                        {error}
                    </p>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit(login)}
                    className='mt-8'
                >
                    <div className='space-y-5'>

                        {/* Email Field */}
                        <Input
                            label='Email'
                            Placeholder='Enter your email'
                            type='email'


                            {...register('email', {
                                required: true,

                                // Custom email validation
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
                                        ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />

                        {/* Password Field */}
                        <Input
                            label='Password'
                            type='password'
                            Placeholder='Enter your password'

                            {...register('password', {
                                required: true,
                            })}
                        />

                        {/* Submit Button */}
                        <Button
                            type='submit'
                            className='w-full'
                        >
                            Sign In
                        </Button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

