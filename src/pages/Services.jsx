import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IconArrowRight, IconStar } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const docRef = doc(db, 'siteContent', 'services');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().items && docSnap.data().items.length > 0) {
                    const items = docSnap.data().items.map((item, index) => {
                        let bgColor = item.bgColor;
                        let textColor = item.textColor;

                        if (!bgColor && item.color) {
                            const colors = item.color.split(' ');
                            bgColor = colors[0] || 'bg-blue-50';
                            textColor = colors[1] || 'text-blue-600';
                        }

                        return {
                            id: item.id || String(index + 1),
                            title: item.title || 'Service',
                            desc: item.desc || item.description || 'Professional cleaning service.',
                            price: item.price || 'Contact for pricing',
                            bgColor: bgColor || 'bg-blue-50',
                            textColor: textColor || 'text-blue-600',
                            icon: item.icon || '✨',
                        };
                    });
                    setServices(items);
                } else {
                    setDefaultServices();
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                setDefaultServices();
            } finally {
                setLoading(false);
            }
        };

        const setDefaultServices = () => {
            setServices([
                { id: '1', title: 'Kindergarten & Childcare', desc: 'Specialized cleaning protocols for toys, play areas, and classrooms using non-toxic products.', price: 'From €150/visit', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: '🏫' },
                { id: '2', title: 'Office & Commercial', desc: 'Regular maintenance and deep cleaning for offices, retail spaces, and commercial buildings.', price: 'From €200/visit', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: '🏢' },
                { id: '3', title: 'Residential Cleaning', desc: 'Home cleaning services including kitchens, bathrooms, and living areas.', price: 'From €80/visit', bgColor: 'bg-purple-50', textColor: 'text-purple-600', icon: '🏠' },
                { id: '4', title: 'Deep Disinfection', desc: 'Medical-grade disinfection services for high-risk areas or post-illness recovery.', price: 'Custom Quote', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: '✨' },
                { id: '5', title: 'Carpet & Upholstery', desc: 'Steam cleaning and stain removal for carpets, rugs, and furniture.', price: 'From €50/room', bgColor: 'bg-orange-50', textColor: 'text-orange-600', icon: '🧹' },
                { id: '6', title: 'Window & Facade', desc: 'Interior and exterior window cleaning for a crystal-clear view.', price: 'From €100', bgColor: 'bg-teal-50', textColor: 'text-teal-600', icon: '🪟' },
            ]);
        };

        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">{t('ourServices')}</h1>
                    <p className="text-blue-100 text-lg">{t('servicesIntro')}</p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((s) => (
                            <div key={s.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-slate-100 flex flex-col">
                                <div className={`w-16 h-16 ${s.bgColor} ${s.textColor} rounded-2xl flex items-center justify-center mb-6 text-3xl`}>
                                    {s.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                                <p className="text-slate-500 mb-6 flex-grow">{s.desc}</p>
                                <div className="border-t border-slate-100 pt-6 mt-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-blue-600 font-bold text-lg">{s.price}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <IconStar key={i} />)}
                                        </div>
                                    </div>
                                    <Link to="/contact" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                                        {t('bookNow')}
                                        <IconArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('needCustomPlan')}</h2>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition">
                        {t('getFreeQuote')}
                        <IconArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
