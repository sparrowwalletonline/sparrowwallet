
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
  Sparkles,
  Shield
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-8">
      <div className="container mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Logo and company info */}
          <div className="col-span-1 px-4">
            <div className="flex items-center gap-2 mb-4">
              <WalletLogo className="w-8 h-8" useSparrowLogo={true} color="sparrow" />
              <span className="font-playfair text-xl font-bold text-white">Sparrow Wallet</span>
            </div>
            <p className="text-sm mb-4">
              Eine moderne, umfassende Bitcoin-Wallet mit einer fortschrittlichen Benutzeroberfläche für datenschutzbewusste Benutzer
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
          <div className="px-4">
            <h3 className="font-playfair font-medium text-white mb-4">Ressourcen</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Sparkles size={16} />
                  <span>Funktionen</span>
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span>Dokumentation</span>
                </Link>
              </li>
              <li>
                <Link to="/support" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <MessageCircle size={16} />
                  <span>Support</span>
                </Link>
              </li>
              <li>
                <a href="https://sparrowwallet.com/download/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Download size={16} />
                  <span>Herunterladen</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="px-4">
            <h3 className="font-playfair font-medium text-white mb-4">Über uns</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Info size={16} />
                  <span>Über uns</span>
                </Link>
              </li>
              <li>
                <Link to="/donate" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <Heart size={16} />
                  <span>Spenden</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <FileText size={16} />
                  <span>Nutzungsbedingungen</span>
                </Link>
              </li>
              <li>
                <a href="https://sparrowwallet.com/releases/" className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                  <ExternalLink size={16} />
                  <span>Versionen</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Online version message */}
          <div className="px-4">
            <h3 className="font-playfair font-medium text-white mb-4">Online-Version</h3>
            <p className="text-sm mb-4">Dies ist die Online-Version von Sparrow Wallet. Für ein sichereres Erlebnis empfehlen wir den Download der Desktop-Version.</p>
            <a 
              href="https://sparrowwallet.com/download/" 
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Download size={16} />
              <span>Desktop-App herunterladen</span>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center px-4">
          <p className="text-sm">© {new Date().getFullYear()} Sparrow Wallet. MIT-Lizenziert. Open-Source-Software.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://sparrowwallet.com/" className="text-sm hover:text-blue-400 transition-colors flex items-center gap-1">
              <Globe size={14} />
              <span>Offizielle Seite</span>
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
