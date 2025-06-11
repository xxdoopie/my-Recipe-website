import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModule.jsx';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

function Navigation({sendUpdatedPage, sendQueryFromNav}) {
  const [searchTrue, setSearchTrue] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, type: 'login' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      handleNavigation('home');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleKeyDown = (event) => {
    if(event.key === 'Enter'){
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      sendQueryFromNav(searchQuery.trim());
      sendUpdatedPage("recipes");
      setSearchTrue(false); // Close search on desktop after search
    }
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    sendUpdatedPage(page);
    if (page === "recipes") {
      sendQueryFromNav(''); // Clear search query when navigating to recipes
    }
  };

  const mobileLinks = [
    { name: "Home", key: "home" },
    { name: "Recipes", key: "recipes" },
    { name: "Favourites", key: "favourites" },
    ...(user
      ? [
          { name: "Profile", key: "profile" },
          { name: "Logout", key: "logout" }
        ]
      : [
          { name: "Login", key: "login" },
          { name: "Sign Up", key: "signup" }
        ]
    ),
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);
  
  return (
    <div className='z-50 sticky top-0'>
      {/* Desktop Nav */}
      <div className="headerNav hidden sm:flex justify-between items-center px-4 md:px-6 py-4 w-full bg-mainTheme">
        <h1 className="font-bold text-white flex items-center gap-2 cursor-pointer"
        onClick={() => handleNavigation("home")}>
        
          Chop <span className="text-black">Drop</span>
           <img src="assets/logo logo new.png" width={50} alt="" />

        </h1>

        {/* Page Navigation */}
        <div className={`${searchTrue ? 'hidden' : 'flex'} gap-10`}>
          <h2
            className={`cursor-pointer ${activePage === "home" ? 'text-white' : 'text-black'}`}
            onClick={() => handleNavigation("home")}
          >
            Home
          </h2>
          <h2
            className={`cursor-pointer ${activePage === "recipes" ? 'text-white' : 'text-black'}`}
            onClick={() => handleNavigation("recipes")}
          >
            Recipes
          </h2>
        </div>

        {/* Search bar */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            searchTrue ? 'max-w-lg opacity-100 scale-100' : 'max-w-0 opacity-0 scale-0'
          } relative w-full`}
        >
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img src="/assets/MagnifyingGlassGray.png" alt="Search" className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
          />
        </div>

        <div className="navItems flex items-center gap-4">
          <img
            src="/assets/MagnifyingGlass.png"
            alt="Search"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setSearchTrue(!searchTrue)}
          />
          <img 
            src="/assets/heart.png" 
            alt="Favorites" 
            className="w-6 h-6 cursor-pointer" 
            onClick={() => handleNavigation("favourites")}
          />
          <div className="relative user-menu">
            {user ? (
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-6 h-6 text-white" />
                )}
                <span className="text-white text-sm hidden md:block">
                  {user.displayName || user.email}
                </span>
              </div>
            ) : (
              <img
                src="/assets/User.png"
                alt="User"
                className="w-6 h-6 cursor-pointer"
                onClick={() => setAuthModal({ open: true, type: 'login' })}
              />
            )}

            {/* User Dropdown Menu */}
            {showUserMenu && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => {
                    handleNavigation("profile");
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleNavigation("favourites");
                    setShowUserMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Favorites
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="mobileNav flex sm:hidden justify-between items-center px-4 py-4 w-full bg-mainTheme relative">
        <div className="flex items-center gap-3">
          <img
            src="/assets/bar.png"
            alt="Menu"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          />
          <h1 className="font-bold text-xl text-white flex items-center gap-2"
        onClick={() => handleNavigation("home")}>
        
          Chop<span className="text-black">Drop</span>
        

        </h1>
        </div>
        <div className="relative w-[40%]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img src="/assets/MagnifyingGlassGray.png" alt="Search" className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
          />
        </div>
        <img
          src="/assets/heart.png"
          alt="Favorites"
          className="w-6 h-6 cursor-pointer"
          onClick={() => handleNavigation("favourites")}
        />
      </div>

      {/* Full Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col items-start p-6 gap-6">
          <div className="flex justify-between w-full items-center mb-4">
            <h1 className="font-bold text-2xl text-mainTheme">
              Recipe <span className="text-black">finder</span>
            </h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-xl font-bold text-gray-700"
            >
              ✕
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-3 mb-4">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-600" />
              )}
              <div>
                <p className="font-semibold">{user.displayName || 'User'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
          )}

          {mobileLinks.map(link => (
            <button
              key={link.key}
              onClick={() => {
                if (link.key === 'logout') {
                  handleLogout();
                } else if (link.key === 'login' || link.key === 'signup') {
                  setAuthModal({ open: true, type: link.key });
                } else {
                  handleNavigation(link.key);
                }
                setMobileMenuOpen(false);
              }}
              className={`text-lg font-semibold ${
                activePage === link.key ? 'text-mainTheme' : 'text-gray-800'
              } hover:text-mainTheme transition-colors`}
            >
              {link.name}
            </button>
          ))}

          <div className="mt-auto w-full text-center text-sm text-gray-500">
            © 2025 RecipeFinder. All rights reserved.
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModal.open}
        isRegister={authModal.type === 'signup'}
        onClose={(next = null) =>
          next
            ? setAuthModal({ open: true, type: next })
            : setAuthModal({ open: false, type: 'login' })
        }
      />
    </div>
  );
}

export default Navigation;