
import React from 'react';
import { Link } from 'react-router-dom';
import WalletLogo from '@/components/WalletLogo';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Mail
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and company info */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <WalletLogo className="w-8 h-8" />
              <span className="font-heading text-xl font-bold text-gray-800">Trust Wallet</span>
            </div>
            <p className="text-sm mb-4">
              The most trusted & secure crypto wallet
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-500" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-600" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-pink-500" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-700" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-gray-800" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Links column 1 */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/wallet" className="hover:text-blue-500 transition-colors">Wallet</Link></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Exchange</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">NFT Marketplace</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">DeFi Platform</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Staking</a></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Community</a></li>
              <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div>
            <h3 className="font-medium text-gray-800 mb-4">Subscribe to our newsletter</h3>
            <p className="text-sm mb-4">Get the latest news and updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Trust Wallet. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm hover:text-blue-500 transition-colors">Terms</Link>
            <a href="#" className="text-sm hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="text-sm hover:text-blue-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
