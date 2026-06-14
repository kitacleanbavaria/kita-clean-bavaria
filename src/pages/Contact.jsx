import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconPhone, IconMail, IconMapPin, IconClock, IconWhatsApp, IconFacebook, IconInstagram, IconTwitter } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

// EmailJS imports
import emailjs from '@emailjs/browser';

// EmailJS public browser config. Values are provided by Vite env variables.
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  CUSTOMER_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
  ADMIN_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  ADMIN_EMAIL: import.meta.env.VITE_EMAILJS_ADMIN_EMAIL,
};

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  serviceDetails: [],
  roomCount: '',
  message: ''
};

const quoteOptions = {
  kindergarten: {
    detailLabel: 'Kindergarten areas',
    sizeLabel: 'How many rooms or areas?',
    details: [
      'Classrooms / group rooms',
      'Toilets and washrooms',
      'Play areas',
      'Kitchen or dining area',
      'Entrance and hallway',
      'Whole kindergarten'
    ],
    sizes: ['1-2 rooms', '3-5 rooms', '6-10 rooms', 'More than 10 rooms']
  },
  office: {
    detailLabel: 'Office sections',
    sizeLabel: 'How many office rooms or sections?',
    details: [
      'Individual office rooms',
      'Whole office',
      'Meeting rooms',
      'Kitchen / break room',
      'Reception area',
      'Toilets and washrooms'
    ],
    sizes: ['Small office', 'Medium office', 'Large office', 'Multiple floors']
  },
  residential: {
    detailLabel: 'Home areas',
    sizeLabel: 'Home size',
    details: [
      'Kitchen',
      'Bathroom',
      'Bedrooms',
      'Living room',
      'Windows',
      'Whole home'
    ],
    sizes: ['Studio / 1 room', '2-3 rooms', '4-5 rooms', 'Large home']
  },
  deep: {
    detailLabel: 'Deep cleaning type',
    sizeLabel: 'Approximate size',
    details: [
      'Office deep cleaning',
      'School / kindergarten deep cleaning',
      'Carpet deep cleaning',
      'Kitchen deep cleaning',
      'Bathroom deep cleaning',
      'Post-renovation cleaning'
    ],
    sizes: ['Small area', 'Medium area', 'Large area', 'Multiple rooms / sections']
  }
};

const Contact = () => {
  const { t } = useLanguage();
  const { user } = useAdmin();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [botMessage, setBotMessage] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const contactRef = doc(db, 'siteContent', 'contact');
        const contactSnap = await getDoc(contactRef);
        let data = null;
        if (contactSnap.exists()) {
          data = contactSnap.data();
        } else {
          const homeRef = doc(db, 'siteContent', 'home');
          const homeSnap = await getDoc(homeRef);
          if (homeSnap.exists()) {
            const homeData = homeSnap.data();
            data = { ...homeData.footer, ...homeData.header };
          }
        }
        if (data) {
          setContactInfo({
            companyName: data.companyName || data.company || 'Isarkita',
            phone: data.phone || data.phoneNumber || '+49 123 456 789',
            email: data.email || 'info@isarkita.de',
            address: data.address || 'Munich, Germany',
            hours: data.hours || data.businessHours || 'Mon - Fri: 8:00 - 18:00',
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            instagram: data.instagram || '',
            whatsapp: data.whatsapp || ''
          });
        } else {
          setContactInfo({
            companyName: 'Isarkita',
            phone: '+49 123 456 789',
            email: 'info@isarkita.de',
            address: 'Munich, Germany',
            hours: 'Mon - Fri: 8:00 - 18:00',
            facebook: '',
            twitter: '',
            instagram: '',
            whatsapp: ''
          });
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Error loading data: ' + err.message);
        setContactInfo({
          companyName: 'Isarkita',
          phone: '+49 123 456 789',
          email: 'info@isarkita.de',
          address: 'Munich, Germany',
          hours: 'Mon - Fri: 8:00 - 18:00',
          facebook: '',
          twitter: '',
          instagram: '',
          whatsapp: ''
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const selectedQuoteOptions = quoteOptions[formData.service];

  const toggleServiceDetail = (detail) => {
    setFormData(prev => {
      const exists = prev.serviceDetails.includes(detail);
      return {
        ...prev,
        serviceDetails: exists
          ? prev.serviceDetails.filter(item => item !== detail)
          : [...prev.serviceDetails, detail]
      };
    });
  };

  const quoteDetailsText = (quoteData) => {
    const details = quoteData.serviceDetails?.length ? quoteData.serviceDetails.join(', ') : 'Not specified';
    return `Selected areas: ${details}; Size: ${quoteData.roomCount || 'Not specified'}`;
  };

  // Send auto-reply email to customer
  const sendCustomerAutoReply = async (quoteData) => {
    try {
      const templateParams = {
        to_name: quoteData.name,
        email: quoteData.email,
        from_name: contactInfo?.companyName || 'Isarkita',
        service_type: quoteData.service || 'cleaning services',
        quote_details: quoteDetailsText(quoteData),
        reply_to: contactInfo?.email || 'info@isarkita.de',
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      console.log('Customer auto-reply sent!');
    } catch (err) {
      console.error('Customer email failed:', err);
    }
  };

  // Send notification email to admin
  const sendAdminNotification = async (quoteData) => {
    try {
      const templateParams = {
        to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
        from_name: contactInfo?.companyName || 'Isarkita',
        customer_name: quoteData.name,
        customer_email: quoteData.email,
        customer_phone: quoteData.phone || 'Not provided',
        service_type: quoteData.service || 'Not specified',
        quote_details: quoteDetailsText(quoteData),
        message: quoteData.message || 'No message',
        quote_date: new Date().toLocaleString(),
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.ADMIN_TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      console.log('Admin notification sent!');
    } catch (err) {
      console.error('Admin email failed:', err);
    }
  };

  // Bot reply message
  const getBotReply = (name, service) => {
    const replies = [
      `Hi ${name}! Thank you for reaching out to us! We've received your quote request for ${service || 'our cleaning services'}. Our team will review it and get back to you within 24 hours. Have a great day!`,
      `Hello ${name}! Your quote request has been received! We're excited to help you with ${service || 'your cleaning needs'}. Expect a response from our team within 24 hours.`,
      `Thanks ${name}! We've got your request for ${service || 'cleaning services'}. Our experts are already reviewing it. You'll hear from us within 24 hours!`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setStatus('login-required');
      return;
    }

    setStatus('sending');
    setBotMessage('');

    try {
      // 1. Save quote to Firebase
      const quoteRef = await addDoc(collection(db, "quotes"), {
        ...formData,
        userId: auth.currentUser?.uid || user.uid,
        userEmail: auth.currentUser?.email || user.email || formData.email,
        status: 'new',
        createdAt: serverTimestamp()
      });

      console.log('Quote saved:', quoteRef.id);

      // 2. Send auto-reply to customer
      await sendCustomerAutoReply(formData);

      // 3. Send notification to admin
      await sendAdminNotification(formData);

      // 4. Show bot reply
      const botReply = getBotReply(formData.name, formData.service);
      setBotMessage(botReply);

      // 5. Success!
      setStatus('success');
      setFormData(initialFormData);

    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  const cleanWhatsAppNumber = (num) => {
    return num.replace(/[^0-9+]/g, '');
  };

  if (loading || !contactInfo) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header Banner */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('getYourFreeQuote')}</h1>
          <p className="text-blue-100 text-lg">{t('contactIntro')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Bot Reply Message */}
        {botMessage && (
          <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl shadow-lg animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
                🤖
              </div>
              <div>
                <p className="font-bold text-green-800 mb-1">Auto-Reply Bot</p>
                <p className="text-green-700">{botMessage}</p>
                <p className="text-sm text-green-500 mt-2">Email sent to {formData.email || 'your email'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT SIDE - Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-blue-900">{contactInfo.companyName}</h2>
              <p className="text-slate-500 mt-1">{t('professionalCleaningServices')}</p>
            </div>

            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <IconPhone />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase">{t('callUs')}</p>
                <p className="font-bold text-slate-800 text-lg group-hover:text-blue-600">{contactInfo.phone}</p>
              </div>
            </a>

            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition group">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                <IconMail />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase">{t('emailUs')}</p>
                <p className="font-bold text-slate-800 text-lg group-hover:text-green-600">{contactInfo.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <IconMapPin />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase">{t('visitUs')}</p>
                <p className="font-bold text-slate-800 text-lg">{contactInfo.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <IconClock />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium uppercase">{t('businessHours')}</p>
                <p className="font-bold text-slate-800 text-lg">{contactInfo.hours}</p>
              </div>
            </div>

            {(contactInfo.facebook || contactInfo.twitter || contactInfo.instagram || contactInfo.whatsapp) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-sm text-slate-400 font-medium uppercase mb-4">{t('connectWithUs')}</p>
                <div className="flex flex-wrap gap-3">
                  {contactInfo.whatsapp && (
                    <a href={`https://wa.me/${cleanWhatsAppNumber(contactInfo.whatsapp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition">
                      <IconWhatsApp />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {contactInfo.facebook && (
                    <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                      <IconFacebook />
                      <span>Facebook</span>
                    </a>
                  )}
                  {contactInfo.instagram && (
                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-xl font-bold transition">
                      <IconInstagram />
                      <span>Instagram</span>
                    </a>
                  )}
                  {contactInfo.twitter && (
                    <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition">
                      <IconTwitter />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            {!user ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <IconMail />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{t('signInToRequestQuote')}</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-8">{t('signInToRequestQuoteHelp')}</p>
                <Link to="/login?redirect=/contact" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                  {t('continueToSignIn')}
                  <IconArrowRight />
                </Link>
              </div>
            ) : status === 'success' ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-5xl">🎉</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{t('quoteRequested')}</h3>
                <p className="text-slate-600">{t('confirmationSent')}</p>
                <button onClick={() => { setStatus(''); setBotMessage(''); }} className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition">
                  {t('sendAnotherRequest')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('fullName')} *</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('emailAddress')} *</label>
                    <input required type="email" placeholder="john@example.com" className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('phoneNumber')}</label>
                    <input type="tel" placeholder="+49 123 456 789" className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t('serviceType')}</label>
                    <select
                      className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none bg-white"
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value, serviceDetails: [], roomCount: '' })}
                    >
                      <option value="">{t('selectService')}</option>
                      <option value="kindergarten">{t('kindergartenCleaning')}</option>
                      <option value="office">{t('officeCleaning')}</option>
                      <option value="residential">{t('residentialCleaning')}</option>
                      <option value="deep">{t('deepCleaning')}</option>
                    </select>
	                  </div>
	                </div>
                {selectedQuoteOptions && (
                  <div className="space-y-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">{selectedQuoteOptions.detailLabel}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedQuoteOptions.details.map((detail) => (
                          <label key={detail} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-blue-100 text-sm font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={formData.serviceDetails.includes(detail)}
                              onChange={() => toggleServiceDetail(detail)}
                              className="h-4 w-4 accent-blue-600"
                            />
                            <span>{detail}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{selectedQuoteOptions.sizeLabel}</label>
                      <select
                        className="w-full px-5 py-4 rounded-xl border-2 border-blue-100 focus:border-blue-500 outline-none bg-white"
                        value={formData.roomCount}
                        onChange={e => setFormData({ ...formData, roomCount: e.target.value })}
                      >
                        <option value="">Select size...</option>
                        {selectedQuoteOptions.sizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('yourMessage')}</label>
                  <textarea rows={5} placeholder={t('messagePlaceholder')} className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-none resize-none" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                </div>
                <button type="submit" disabled={status === 'sending'} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                  {status === 'sending' ? t('sending') : t('requestFreeQuote')}
                  <IconArrowRight />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
