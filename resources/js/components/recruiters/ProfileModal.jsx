import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosClient } from '../../api/axios';

export default function ProfileModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('profile');

    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const { register: registerPassword, handleSubmit: handleSubmitPassword, setError: setPasswordError, formState: { errors: passwordErrors }, watch } = useForm();

    const onSubmitProfile = async (data) => {
        try {
            await axiosClient.put('/profile', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onClose();
        } catch (error) {
            setError('general', { message: 'Failed to update profile' });
        }
    };

    const onSubmitPassword = async (data) => {
        try {
            await axiosClient.put('/change-password', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            onClose();
        } catch (error) {
            setPasswordError('general', { message: 'Failed to change password' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <button className="text-black float-right" onClick={onClose}>X</button>
                <h2 className="text-2xl font-bold mb-4">Profile</h2>

                <div className="flex border-b mb-4">
                    <button
                        className={`flex-1 p-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''} text-gray-800`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Modifier Profil
                    </button>
                    <button
                        className={`flex-1 p-2 ${activeTab === 'password' ? 'border-b-2 border-blue-500' : ''} text-gray-800`}
                        onClick={() => setActiveTab('password')}
                    >
                        Changer Mot de Passe
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <form onSubmit={handleSubmit(onSubmitProfile)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                className="w-full px-3 py-2 border rounded text-black"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Email</label>
                            <input
                                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' } })}
                                className="w-full px-3 py-2 border rounded text-black"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Valider</button>
                    </form>
                )}

                {activeTab === 'password' && (
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div className="mb-4">
                            <label className="block text-gray-700">Old Password</label>
                            <input
                                {...registerPassword('oldPassword', { required: 'Old password is required' })}
                                type="password"
                                className="w-full px-3 py-2 border rounded text-black"
                            />
                            {passwordErrors.oldPassword && <p className="text-red-500">{passwordErrors.oldPassword.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">New Password</label>
                            <input
                                {...registerPassword('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                                type="password"
                                className="w-full px-3 py-2 border rounded text-black"
                            />
                            {passwordErrors.newPassword && <p className="text-red-500">{passwordErrors.newPassword.message}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Confirm New Password</label>
                            <input
                                {...registerPassword('confirmPassword', { required: 'Please confirm your new password', validate: (value) => value === watch('newPassword') || 'Passwords do not match' })}
                                type="password"
                                className="w-full px-3 py-2 border rounded text-black"
                            />
                            {passwordErrors.confirmPassword && <p className="text-red-500">{passwordErrors.confirmPassword.message}</p>}
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Valider</button>
                    </form>
                )}
            </div>
        </div>
    );
}
