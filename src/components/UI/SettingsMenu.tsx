import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe } from 'lucide-react';

export default function SettingsMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-black/90 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t('settings')}</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white"><X /></button>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Globe className="text-indigo-400" />
                <span className="text-white font-bold">{t('language')}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-2 rounded-xl font-bold ${i18n.language === 'en' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'}`}
                >
                  {t('english')}
                </button>
                <button 
                  onClick={() => changeLanguage('ar')}
                  className={`px-4 py-2 rounded-xl font-bold ${i18n.language === 'ar' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'}`}
                >
                  {t('arabic')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
