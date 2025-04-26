import React from 'react';

function AuthModal({ isOpen, onClose, isRegister = false }) {
  if (!isOpen) return null;

  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10"
    onClick={() => onClose()}
  >
    <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        >
    
        <h2 className="text-2xl font-bold text-mainTheme mb-4 text-center">
          {isRegister ? 'Create an Account' : 'Login'}
        </h2>

        <form className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
          />
          <button className="bg-mainTheme text-white py-3 rounded-md font-semibold hover:opacity-90">
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-mainTheme font-semibold underline cursor-pointer"
            onClick={() => onClose(isRegister ? 'login' : 'signup')}
          >
            {isRegister ? 'Login here' : 'Sign up here'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
