import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Lock, Eye, Check, Shield, Key, Zap } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useMenu } from '@/contexts/MenuContext';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import FeaturesSection from '@/components/FeaturesSection';
import SupportedAssetsSection from '@/components/SupportedAssetsSection';
import Header from '@/components/Header';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const LandingPage = () => {
  const { hasWallet, session } = useWallet();
  const { toggleMenu } = useMenu();
  const navigate = useNavigate();

  const navigateToRegister = () => navigate('/register');
  const handleLoginClick = () => navigate('/auth');
  const handleWalletAccess = () => navigate(hasWallet ? '/wallet' : '/generate-wallet');

  const ActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {session ? (
        <Button
          onClick={handleWalletAccess}
          className="w-full sm:w-auto py-6 text-base gap-2 text-white font-medium rounded-xl landing-glass-button"
          type="button"
        >
          {hasWallet ? 'Auf Wallet Zugreifen' : 'Wallet Erstellen'} <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button
            onClick={navigateToRegister}
            className="w-full sm:w-auto py-6 text-base gap-2 text-white font-medium rounded-xl landing-glass-button"
            type="button"
          >
            Registrieren <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto py-6 text-base rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={handleLoginClick}
            type="button"
          >
            Anmelden
          </Button>
        </>
      )}
      <Button
        variant="outline"
        className="w-full sm:w-auto py-6 text-base rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
        onClick={() => window.open('https://sparrowwallet.com/download/', '_blank')}
        type="button"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Download Desktop App
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e1a] text-white">
      <Header title="" showMenuToggle={true} showProfileButton={false} />

      <div className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 px-6 overflow-hidden landing-hero-bg">
          {/* Glow Orbs */}
          <div className="landing-orb landing-orb-blue" />
          <div className="landing-orb landing-orb-purple" />
          <div className="landing-orb landing-orb-green" />

          <motion.div
            className="max-w-screen-xl mx-auto relative z-10"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <p className="text-blue-400 font-medium mb-4 text-sm tracking-widest uppercase">Sparrw Wallet</p>
              <h1 className="font-roboto text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight mb-6">
                Deine sichere
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Krypto Festung.
                </span>
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto text-sm">
                Sparrw ist eine Bitcoin-Wallet für alle, die finanziell selbstbestimmt sein wollen.
                Jetzt auch als sichere, vollständige Webanwendung verfügbar.
              </p>
            </motion.div>

            {/* Pill Badges */}
            <motion.div className="flex flex-wrap justify-center gap-3 mb-10" variants={fadeInUp}>
              {[
                { icon: <Shield className="h-4 w-4" />, label: 'Sicher', color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30' },
                { icon: <Key className="h-4 w-4" />, label: 'Privat', color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30' },
                { icon: <Zap className="h-4 w-4" />, label: 'Schnell', color: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border bg-gradient-to-r ${badge.color} backdrop-blur-sm text-sm font-medium text-white`}
                >
                  {badge.icon} {badge.label}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp}>
              <ActionButtons />
            </motion.div>

            {/* Screenshot with glow */}
            <motion.div
              className="relative mt-16 flex justify-center"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
              </div>
              <img
                src="/lovable-uploads/1b77eb0f-8d23-4584-b764-6202a16c8247.png"
                alt="Bitcoin Wallet App"
                className="w-full max-w-2xl mx-auto z-10 rounded-2xl shadow-2xl shadow-blue-500/20 border border-white/10"
                style={{ transform: 'perspective(1000px) rotateX(2deg)' }}
              />
            </motion.div>

            {/* Description box */}
            <motion.div
              className="max-w-3xl mx-auto mt-12 px-8 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-sm leading-relaxed text-gray-300 text-center"
              variants={fadeInUp}
            >
              <p className="mb-3">
                Sparrw ist einzigartig, da es einen vollwertigen Transaktionseditor enthält, der auch als Blockchain-Explorer fungiert. Diese Funktion ermöglicht nicht nur die Bearbeitung aller Felder einer Transaktion, sondern auch eine einfache Überprüfung der Transaktionsbytes vor der Übertragung.
              </p>
              <p>
                Obwohl Sparrw eine Wallet für fortgeschrittene Benutzer ist, ist sie nicht schwer zu bedienen.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <SupportedAssetsSection />
        <FeaturesSection />

        {/* Security Section */}
        <motion.section
          className="px-6 py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #0f1524 0%, #0a0e1a 100%)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div className="max-w-screen-xl mx-auto text-center" variants={fadeInUp}>
            <h2 className="font-roboto text-4xl font-bold mb-12">Sicherheit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: <Lock className="w-8 h-8" />, title: 'Volle Kontrolle', desc: 'Sie haben die volle Kontrolle über Ihre privaten Schlüssel und Ihre Bitcoin.', glow: 'shadow-blue-500/30' },
                { icon: <Eye className="w-8 h-8" />, title: 'Open Source', desc: 'Der Code ist öffentlich einsehbar und von der Community geprüft.', glow: 'shadow-purple-500/30' },
                { icon: <Check className="w-8 h-8" />, title: 'Non-Custodial', desc: 'Ihre Bitcoin werden nicht von Dritten verwahrt.', glow: 'shadow-emerald-500/30' },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  className={`flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1`}
                  variants={fadeInUp}
                >
                  <div className={`mb-5 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shadow-lg ${card.glow}`}>
                    {card.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Steps Section */}
        <motion.section
          className="px-6 py-20 relative overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0f1524 100%)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div className="max-w-screen-xl mx-auto text-center" variants={fadeInUp}>
            <h2 className="font-roboto text-4xl font-bold mb-12">Einfache Schritte zum Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-emerald-500/40" />

              {[
                { n: 1, title: 'Wallet erstellen', desc: 'Erstellen Sie eine neue Wallet oder importieren Sie eine bestehende.', gradient: 'from-blue-500 to-blue-600' },
                { n: 2, title: 'Bitcoin empfangen', desc: 'Empfangen Sie Bitcoin von Freunden, Familie oder einer Börse.', gradient: 'from-purple-500 to-purple-600' },
                { n: 3, title: 'Bitcoin senden', desc: 'Senden Sie Bitcoin an jeden auf der Welt.', gradient: 'from-emerald-500 to-emerald-600' },
              ].map((step) => (
                <motion.div
                  key={step.n}
                  className="flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1 relative z-10"
                  variants={fadeInUp}
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.gradient} text-white font-bold text-xl flex items-center justify-center mb-4 shadow-lg`}>
                    {step.n}
                  </div>
                  <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div className="pt-12" variants={fadeInUp}>
              <ActionButtons />
            </motion.div>
          </motion.div>
        </motion.section>

        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
