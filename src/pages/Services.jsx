import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IconArrowRight, IconStar, IconKindergarten, IconHygiene, IconWindowClean } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const curatedServices = [
        { id: 'kindergarten-daily', type: 'kindergarten', title: 'Daily Kindergarten Cleaning', desc: 'Reliable daily cleaning for classrooms, play areas, toilets, tables, floors and shared spaces—planned around your opening hours.' },
        { id: 'deep-hygiene', type: 'hygiene', title: 'Deep Hygiene Cleaning', desc: 'A thorough hygiene clean for high-touch surfaces, sanitary areas and spaces that need extra attention during holidays or after illness.' },
        { id: 'kindergarten-windows', type: 'windows', title: 'Kindergarten Window Cleaning', desc: 'Careful interior and exterior window cleaning for brighter rooms, clear glass and a welcoming first impression.' }
    ];

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const docRef = doc(db, 'siteContent', 'services');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().items?.length) {
                    const items = docSnap.data().items;
                    const findService = (terms) => items.find(item => terms.some(term => `${item.title} ${item.desc || item.description || ''}`.toLowerCase().includes(term)));
                    const matches = [
                        findService(['kindergarten', 'daily']),
                        findService(['deep', 'hygiene', 'disinfection']),
                        findService(['window', 'fenster'])
                    ];
                    setServices(curatedServices.map((fallback, index) => {
                        const match = matches[index];
                        return match ? { ...fallback, title: match.title || fallback.title, desc: match.desc || match.description || fallback.desc } : fallback;
                    }));
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
            setServices(curatedServices);
        };

        fetchServices();
    }, []);

    const serviceIcons = {
        kindergarten: <IconKindergarten />,
        hygiene: <IconHygiene />,
        windows: <IconWindowClean />
    };

    if (loading) {
        return (
            <div className="site-loader" aria-label="Loading"><span /></div>
        );
    }

    return (
        <div className="min-h-screen inner-page services-page">
            {/* Header */}
            <div className="inner-page-hero">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="inner-page-kicker">Kita Clean Bavaria</p>
                    <h1 className="text-4xl font-bold text-white mb-4">{t('ourServices')}</h1>
                    <p className="text-blue-100 text-lg">{t('servicesIntro')}</p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="premium-page-body">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((s) => (
                            <div key={s.id} className="service-page-card">
                                <div className="service-page-icon">
                                    {serviceIcons[s.type]}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                                <p className="text-slate-500 mb-6 flex-grow">{s.desc}</p>
                                <div className="border-t border-slate-100 pt-6 mt-auto">
                                    <div className="flex items-center justify-center mb-4" aria-label="Five star service">
                                        <div className="flex gap-1 service-stars">
                                            {[1, 2, 3, 4, 5].map(i => <IconStar key={i} />)}
                                        </div>
                                    </div>
                                    <Link to="/contact" className="inner-primary-button">
                                        {t('getFreeQuote')}
                                        <IconArrowRight />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="inner-page-cta">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('needCustomPlan')}</h2>
                    <Link to="/contact" className="inner-light-button">
                        {t('getFreeQuote')}
                        <IconArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
