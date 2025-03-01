
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-wallet-darkBg text-white p-6">
      <div className="absolute top-6 left-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="w-full text-center mt-6">
        <h1 className="font-heading text-xl font-medium">Nutzungsbedingungen</h1>
      </div>
      
      <div className="flex-1 w-full max-w-2xl mx-auto mt-8 text-left">
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold mb-2">1. Wallet-Nutzung</h2>
            <p className="text-wallet-gray">
              Die Wallet dient ausschließlich zur Verwaltung Ihrer digitalen Assets. Sie sind allein für die Sicherheit Ihrer Seed Phrase und privaten Schlüssel verantwortlich.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-bold mb-2">2. Sicherheit</h2>
            <p className="text-wallet-gray">
              Bewahren Sie Ihre Seed Phrase an einem sicheren Ort auf. Verlieren Sie Ihre Seed Phrase, verlieren Sie den Zugriff auf Ihre Wallet. Wir können keine verlorenen Seed Phrases wiederherstellen.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-bold mb-2">3. Risiken</h2>
            <p className="text-wallet-gray">
              Kryptowährungen unterliegen Wertschwankungen. Wir übernehmen keine Verantwortung für finanzielle Verluste, die durch Marktschwankungen, Fehltransaktionen oder Sicherheitsverletzungen entstehen.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-bold mb-2">4. Datenschutz</h2>
            <p className="text-wallet-gray">
              Wir sammeln keine persönlichen Daten. Ihre Wallet-Informationen werden lokal auf Ihrem Gerät gespeichert.
            </p>
          </section>
          
          <section>
            <h2 className="text-lg font-bold mb-2">5. Änderungen</h2>
            <p className="text-wallet-gray">
              Wir behalten uns das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Die Nutzung der Wallet nach solchen Änderungen bedeutet Ihr Einverständnis mit den neuen Bedingungen.
            </p>
          </section>
        </div>
        
        <Button
          onClick={() => navigate(-1)}
          className="mt-8 w-full py-6 bg-wallet-blue hover:bg-wallet-darkBlue text-white font-medium"
        >
          Zurück
        </Button>
      </div>
    </div>
  );
};

export default Terms;
