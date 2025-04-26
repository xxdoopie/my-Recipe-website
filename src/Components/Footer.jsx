import React from 'react';

function Footer() {
  return (
    <footer className="bg-mainTheme text-white mt-16 ">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-3">
            Recipe <span className="text-black">Finder</span>
          </h2>
          <p className="text-sm text-white/80">
            Discover thousands of delicious recipes tailored to your taste. Quick, healthy, and easy meals at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/90 text-sm">
            <li><a href="#" className="hover:text-black">Home</a></li>
            <li><a href="#" className="hover:text-black">Recipes</a></li>
            <li><a href="#" className="hover:text-black">Favorites</a></li>
            <li><a href="#" className="hover:text-black">Login</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <ul className="text-sm space-y-2 text-white/90">
            <li>Email: <a href="mailto:support@recipefinder.com" className="hover:text-black">support@tlegendfox@gmail.com</a></li>
            <li>Phone: <span className="text-white/70">+254 794-655-264</span></li>
            <li>Location: <span className="text-white/70">Nairobi, Kenya</span></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Stay Updated</h3>
          <p className="text-sm text-white/80 mb-2">Join our newsletter for new recipes.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-3 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 mt-6 py-4 text-center text-sm text-white/70">
        © {new Date().getFullYear()}RecipeFinder by: Wesley Odhiambo. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
