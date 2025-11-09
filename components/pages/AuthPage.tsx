import React, { useState } from 'react';
import { AnalyticsIcon, SpinnerIcon, ArrowLeftIcon } from '../ui/Icons';
import { UserCredentials } from '../../types';

type AuthStep = 'initial' | 'signin' | 'signup';

interface AuthPageProps {
  onLoginSuccess: (email: string) => void;
  users: UserCredentials[];
  addUser: (user: UserCredentials) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, users, addUser }) => {
    const [step, setStep] = useState<AuthStep>('initial');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setIsLoading(true);
        // Simulate API call for login
        setTimeout(() => {
            const user = users.find(u => u.email === email.toLowerCase());

            if (user && user.password === password) {
                // User exists and password is correct -> Login
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email.toLowerCase());
                }
                onLoginSuccess(email.toLowerCase());
            } else if (user && user.password !== password) {
                // User exists but password is incorrect
                setError('Incorrect password. Please try again.');
            } else {
                // No user found with this email -> switch to sign up
                setStep('signup');
                setError('No account found. Please confirm your password to create a new account.');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        // Simulate API call for signup
        setTimeout(() => {
            if (users.some(u => u.email === email.toLowerCase())) {
                setError('An account with this email already exists. Please sign in.');
                setIsLoading(false);
                return;
            }

            const newUser = { email: email.toLowerCase(), password };
            addUser(newUser);

            // Automatically log in the new user
             if (rememberMe) {
                localStorage.setItem('rememberedUser', email.toLowerCase());
            }
            onLoginSuccess(email.toLowerCase());
            setIsLoading(false);
        }, 1500);
    };
    
    const resetForm = (targetStep: AuthStep) => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setIsLoading(false);
        setRememberMe(false);
        setStep(targetStep);
    }

    const renderContent = () => {
        switch (step) {
            case 'signin':
                return (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <button type="button" onClick={() => resetForm('initial')} className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4">
                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
                        </button>
                        <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>
                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                        <input
                            type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" autoFocus
                        />
                        <input
                            type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex items-center !mt-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center">
                           {isLoading ? <SpinnerIcon className="animate-spin h-6 w-6"/> : 'Sign In'}
                        </button>
                    </form>
                );
            
            case 'signup':
                return (
                    <form onSubmit={handleSignupSubmit} className="space-y-6">
                        <button type="button" onClick={() => resetForm('initial')} className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-800 mb-4">
                            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
                        </button>
                        <h2 className="text-3xl font-bold text-center text-gray-800">Create your account</h2>
                        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
                        <input
                            type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" autoFocus
                        />
                        <input
                            type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <input
                            type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed flex items-center justify-center">
                           {isLoading ? <SpinnerIcon className="animate-spin h-6 w-6"/> : 'Create Account'}
                        </button>
                    </form>
                );

            case 'initial':
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to expenzo</h2>
                        <p className="text-gray-500 mb-10">Your personal finance companion.</p>
                        <div className="space-y-4">
                            <button 
                                onClick={() => setStep('signin')} 
                                className="w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => setStep('signup')} 
                                className="w-full px-4 py-3 font-semibold text-primary-600 bg-white border-2 border-primary-600 rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                );
        }
    }

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
          <div className="flex items-center mb-8">
              <div className="bg-primary-600 p-3 rounded-xl">
                  <AnalyticsIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold ml-4 text-gray-800">expenzo</h1>
          </div>
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg transition-all duration-300">
            {renderContent()}
          </div>
      </div>
    );
};

export default AuthPage;