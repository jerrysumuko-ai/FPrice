import React from 'react';
import { useForm } from 'react-hook-form';

const SignUpPage = () => {
    const { register, handleSubmit } = useForm();

    const onSubmit = data => {
        // Handle sign-up logic
        // After sign-up, redirect to profile
        window.location.assign('/profile');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('username')} placeholder="Username" />
            <input {...register('password')} type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUpPage;