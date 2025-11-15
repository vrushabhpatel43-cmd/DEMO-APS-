import React, { useState } from 'react';
import { InputField } from './InputField';
import { Button } from './Button';
import type { User } from '../types';
import { findUserByEmail, users } from '../services/userService';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const user = findUserByEmail(email);

        if (user) {
            onLoginSuccess(user);
        } else {
            setError('Access Denied. Please check your email or contact an administrator.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
                    Welcome Back
                </h1>
                <p className="text-lg text-slate-400 mb-8">Please sign in to access the EOD reporter.</p>
                <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-xl shadow-lg p-8 border border-slate-700 space-y-6">
                    <InputField 
                        id="email" 
                        label="Email Address" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        type="email" 
                        placeholder="your.email@estoarkis.com" 
                        required 
                        autoFocus 
                    />
                    {error && <p className="text-red-400 text-sm text-left">{error}</p>}
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>
                <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-left text-sm">
                    <h3 className="font-semibold text-slate-300 mb-2">Demo Accounts</h3>
                    <ul className="space-y-1 text-slate-400">
                        {users.map(user => (
                            <li key={user.email}>
                                <code className="bg-slate-900/50 px-2 py-1 rounded-md text-cyan-300">{user.email}</code>
                                <span className="text-slate-500"> ({user.role})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};