import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconStar } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const [footerData, setFooterData] = useState({
    companyName: 'Isarkita',
    logoImageUrl: '',
    logoText: 'Isarkita',
    logoSubtext: 'REINIGUNG',
    tagline: 'Professional cleaning for kindergartens, offices, and homes. Safe, reliable, and eco-friendly.',
    phone: '+49 123 456 789',
    email: 'info@isarkita.de',
    address: 'Munich, Germany',
    hours: 'Mon - Fri: 8:00 - 18:00',
    facebook: '',
    twitter: '',
    instagram: ''
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const [{ doc, getDoc }, { db }] = await Promise.all([
          import('firebase/firestore'),
          import('../firebase/config'),
        ]);
        const homeRef = doc(db, 'siteContent', 'home');
        const contactRef = doc(db, 'siteContent', 'contact');
        const [homeSnap, contactSnap] = await Promise.all([getDoc(homeRef), getDoc(contactRef)]);
        const contactData = contactSnap.exists() ? contactSnap.data() : {};

        if (homeSnap.exists()) {
          const data = homeSnap.data();
          setFooterData(prev => ({
            ...prev,
            ...contactData,
            ...(data.footer || {}),
            logoImageUrl: data.header?.logoImageUrl || prev.logoImageUrl,
            logoText: data.header?.logoText || data.footer?.companyName || contactData.companyName || prev.logoText,
            logoSubtext: data.header?.logoSubtext || prev.logoSubtext,
          }));
        } else if (contactSnap.exists()) {
          setFooterData(prev => ({
            ...prev,
            ...contactData,
          }));
        }
      } catch (error) {
        console.error('Error fetching footer:', error);
      }
    };
    fetchFooter();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            {footerData.logoImageUrl ? (
              <img src={footerData.logoImageUrl} alt={`${footerData.logoText} logo`} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="bg-yellow-400 p-1.5 rounded-full">
                <IconStar />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{footerData.logoText || footerData.companyName}</h2>
              {footerData.logoSubtext && (
                <p className="text-xs font-semibold text-slate-500 uppercase">{footerData.logoSubtext}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">{footerData.tagline}</p>
          <div className="flex space-x-4">
            {footerData.facebook && (
              <a href={footerData.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">f</a>
            )}
            {footerData.twitter && (
              <a href={footerData.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition cursor-pointer">t</a>
            )}
            {footerData.instagram && (
              <a href={footerData.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">i</a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition">{t('home')}</Link></li>
            <li><Link to="/services" className="hover:text-white transition">{t('services')}</Link></li>
            <li><Link to="/blog" className="hover:text-white transition">{t('blog')}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">{t('contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">{t('services')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-white transition">{t('kindergartenCleaning')}</Link></li>
            <li><Link to="/services" className="hover:text-white transition">{t('officeCleaning')}</Link></li>
            <li><Link to="/services" className="hover:text-white transition">{t('deepCleaning')}</Link></li>
            <li><Link to="/services" className="hover:text-white transition">{t('windowCleaning')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">{t('contactUs')}</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">📞 {footerData.phone}</li>
            <li className="flex items-center gap-2">✉️ {footerData.email}</li>
            <li className="flex items-center gap-2">📍 {footerData.address}</li>
            <li className="flex items-center gap-2">🕒 {footerData.hours}</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <div className="mb-3">
          <Link to="/impressum" className="hover:text-white transition">Impressum</Link>
        </div>
        © {new Date().getFullYear()} {footerData.companyName} Reinigung. {t('allRightsReserved')}
      </div>
    </footer>
  );
};

export default Footer;
