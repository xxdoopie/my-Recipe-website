import React, { useState } from 'react';
import AuthModal from './AuthModule.jsx';
function Navigation({sendUpdatedPage, sendQueryFromNav}) {
  const [searchTrue, setSearchTrue] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, type: 'login' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = (event) =>{
    if(event.key === 'Enter'){
      handleSearch();
    }
  }
  const handleSearch = () =>{
    sendQueryFromNav(`${searchQuery}`)
    sendUpdatedPage("recipes")
  }
  const mobileLinks = [
    { name: "Home", key: "home" },
    { name: "Recipes", key: "recipes" },
    { name: "Favourites", key: "favourites" },
    { name: "Profile", key: "profile" },
    { name: "Login", key: "login" },
    { name: "Sign Up", key: "signup" },
  ];
  
  return (
    <div className='z-50 sticky top-0'>
      {/* Desktop Nav */}
      <div className="headerNav hidden sm:flex justify-between items-center px-4 md:px-6 py-4 w-full bg-mainTheme">
        <h1 className="font-bold text-white">
          Recipe <span className="text-black">finder</span>
        </h1>

        {/* Page Navigation */}
        <div className={`${searchTrue ? 'hidden' : 'flex'} gap-10`}>
          <h2
            className={`cursor-pointer ${activePage === "home" ? 'text-white' : 'text-black'}`}
            onClick={() => {
              setActivePage("home");
              sendUpdatedPage("home")
            }}
    
          >
            Home
          </h2>
          <h2
            className={`cursor-pointer ${activePage === "recipes" ? 'text-white' : 'text-black'}`}
            onClick={() => {
              setActivePage("recipes")
              sendUpdatedPage("recipes")
            }
            }
          >
            Recipes
          </h2>
        </div>

        {/* Search bar */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            searchTrue ? 'max-w-lg opacity-100 scale-100' : 'max-w-0 opacity-0 scale-0'
          } relative w-full`}
          onChange={(e => {
            setSearchQuery(e.target.value);
          })}
          onKeyDown={handleKeyDown}
        >
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img src="/assets/MagnifyingGlassGray.png" alt="Search" className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
          />
        </div>

        <div className="navItems flex items-center gap-4">
          <img
            src="/assets/MagnifyingGlass.png"
            alt="Search"
            className="w-6 h-6"
            onClick={() => setSearchTrue(!searchTrue)}
          />
          <img src="/assets/heart.png" alt="Favorites" className="w-6 h-6" 
          onClick={() => {
            sendUpdatedPage("favourites")
          }}
          />
         <img
            src="/assets/User.png"
            alt="User"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setAuthModal({ open: true, type: 'login' })}
          />
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
          <h1 className="font-bold text-white text-lg">
            Recipe <span className="text-black">finder</span>
          </h1>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden max-w-sm opacity-100 '
          } relative w-[40%]`}
          onChange={(e => {
            setSearchQuery(e.target.value);
          })}
          onKeyDown={handleKeyDown}
        >
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img src="/assets/MagnifyingGlassGray.png" alt="Search" className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-mainTheme"
            onChange={(e => {
              setSearchQuery(e.target.value);
            })}
            onKeyDown={handleKeyDown}
          />
        </div>
        <img
          src="/assets/heart.png"
          alt="Favorites"
          className="w-6 h-6"
          onClick={() => {
            sendUpdatedPage("favourites")
          }}
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

          {mobileLinks.map(link => (
            <button
              key={link.key}
              onClick={() => {
                if(link.key === 'login' || link.key === 'signup' || link.key === 'profile') {
                  setAuthModal({ open: true, type: link.key });
                }
                setActivePage(link.key);
                sendUpdatedPage(link.key);
                setMobileMenuOpen(false);
              }}
              className={`text-lg font-semibold ${
                activePage === link.key ? 'text-mainTheme' : 'text-gray-800'
              } hover:text-mainTheme transition-colors`}
            >
              {link.name}
            </button>
          ))}

          {/* Optional: add divider or extra options */}
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
