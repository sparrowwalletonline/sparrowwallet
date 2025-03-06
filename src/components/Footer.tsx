
import React from 'react';
import { Link } from 'react-router-dom';
import WalletLogo from '@/components/WalletLogo';
import { 
  Github, 
  Twitter, 
  Download,
  FileText,
  Heart,
  Globe,
  Info,
  ExternalLink,
  MessageCircle,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and company info */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <WalletLogo className="w-8 h-8" useSparrowLogo={true} color="sparrow" />
              <span className="font-heading text-xl font-bold text-white">Sparrow Wallet</span>
            </div>
            <p className="text-sm mb-4">
              A modern, comprehensive Bitcoin wallet with an advanced interface for privacy-focused users
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/SparrowWallet" className="text-gray-400 hover:text-blue-400" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://github.com/sparrowwallet/sparrow" className="text-gray-400 hover:text-white" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Links column 1 */}
          <div>
            <h3 className="font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://sparrowwallet.com/features/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Sparkles size={16} />
                  <span>Features</span>
                </a>
              </li>
              <li>
                <a href="https://sparrowwallet.com/docs/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span>Documentation</span>
                </a>
              </li>
              <li>
                <a href="https://sparrowwallet.com/support/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <MessageCircle size={16} />
                  <span>Support</span>
                </a>
              </li>
              <li>
                <a href="https://sparrowwallet.com/download/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Download size={16} />
                  <span>Download</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div>
            <h3 className="font-medium text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://sparrowwallet.com/about/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Info size={16} />
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="https://sparrowwallet.com/donate/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Heart size={16} />
                  <span>Donate</span>
                </a>
              </li>
              <li>
                <Link to="/terms" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span>Terms</span>
                </Link>
              </li>
              <li>
                <a href="https://sparrowwallet.com/releases/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ExternalLink size={16} />
                  <span>Releases</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Online version message */}
          <div>
            <h3 className="font-medium text-white mb-4">Online Version</h3>
            <p className="text-sm mb-4">This is the online version of Sparrow Wallet. For the most secure experience, consider downloading the desktop version.</p>
            <a 
              href="https://sparrowwallet.com/download/" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Download size={16} />
              <span>Download Desktop App</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Sparrow Wallet. MIT Licensed. Open Source Software.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://sparrowwallet.com/" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-1">
              <Globe size={14} />
              <span>Official Site</span>
            </a>
            <a href="https://github.com/sparrowwallet/sparrow" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-1">
              <Github size={14} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
