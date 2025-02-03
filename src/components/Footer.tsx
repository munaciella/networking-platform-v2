import Link from 'next/link';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600 dark:text-gray-300 text-sm">
        
        {/* Left Section - Navigation Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Company</h3>
          <Link href="/" className="hover:underline">About</Link>
          <Link href="/" className="hover:underline">Privacy Policy</Link>
          <Link href="/" className="hover:underline">Contact</Link>
        </div>

        {/* Middle Section - Social Media */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Follow Us</h3>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} className="hover:text-gray-800 dark:hover:text-gray-400" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={20} className="hover:text-blue-400" />
            </a>
          </div>
        </div>

        {/* Right Section - Newsletter Signup */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Stay Updated</h3>
          <p className="text-xs mt-1">Subscribe to get the latest updates.</p>
          <form className="mt-2 flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-3 py-2 text-sm border rounded-l-md outline-none"
            />
            <button 
              type="submit" 
              className="px-3 py-2 bg-blue-600 text-white rounded-r-md text-sm hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Bottom Section - Copyright */}
      <div className="text-center text-xs mt-6 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} NetworkEd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;