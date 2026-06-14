import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IconLeaf, IconShield, IconCalendar, IconUsers, IconCheck, IconArrowRight, IconStar } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const { t } = useLanguage();
    const [content, setContent] = useState({
        heroTitle: 'Professional Cleaning for Every Space',
        heroSubtitle: 'Child-safe cleaning for nurseries and kindergartens',
        heroDescription: 'We create clean, safe, and healthy environments where children can learn, employees can work, and families can thrive.',
        heroImage: '',
        ctaButtonText: 'Request a Quote',
        features: [
            { title: 'Eco-Friendly', desc: 'Non-toxic, child-safe cleaning products.' },
            { title: 'Fully Insured', desc: 'Complete protection and peace of mind.' },
            { title: 'Flexible Schedule', desc: 'Daily, weekly, or custom cleaning plans.' },
            { title: 'Trained Staff', desc: 'Background-checked cleaning experts.' }
        ],
        bannerSection: {
            title: 'Trusted by Schools & Businesses',
            description: 'Over 500+ happy clients trust us with their cleaning needs.',
            image1: '',
            image2: ''
        },
        processSteps: [
            { step: '1', title: 'Request a Quote', desc: 'Tell us about your space and cleaning needs.' },
            { step: '2', title: 'We Plan', desc: 'We create a customized cleaning plan for you.' },
            { step: '3', title: 'We Clean', desc: 'Our trained team cleans with care and attention.' },
            { step: '4', title: 'You Enjoy', desc: 'A clean, safe, and happy environment every day.' }
        ]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const docRef = doc(db, 'siteContent', 'home');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error('Error fetching home content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const iconMap = {
        'Eco-Friendly': <IconLeaf />,
        'Fully Insured': <IconShield />,
        'Flexible Schedule': <IconCalendar />,
        'Trained Staff': <IconUsers />
    };

    const servicesPreview = [
        { title: "Kindergarten Cleaning", desc: "Safe, sanitized spaces for children to learn and play.", bgColor: "bg-blue-50", textColor: "text-blue-600", icon: "🏫" },
        { title: "Office Cleaning", desc: "Boost productivity with a spotless work environment.", bgColor: "bg-green-50", textColor: "text-green-600", icon: "🏢" },
        { title: "Deep Cleaning", desc: "Thorough disinfection for high-traffic areas.", bgColor: "bg-purple-50", textColor: "text-purple-600", icon: "✨" },
        { title: "Window Cleaning", desc: "Crystal clear views for your property.", bgColor: "bg-orange-50", textColor: "text-orange-600", icon: "🪟" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2">
                        <div className="inline-block bg-white text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-6 shadow-sm border border-blue-200">
                            ✨ {content.heroSubtitle}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                            {content.heroTitle}
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg">
                            {content.heroDescription}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/contact" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg text-center flex items-center justify-center gap-2">
                                {content.ctaButtonText}
                                <IconArrowRight />
                            </Link>
                            <Link to="/services" className="bg-white text-blue-600 border-2 border-blue-200 px-8 py-4 rounded-full font-bold text-lg hover:border-blue-400 transition text-center">
                                {t('ourServices')}
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 mt-10">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><IconCheck /></div>
                                <span>500+ {t('clients')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"><IconStar /></div>
                                <span>4.9 {t('rating')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><IconShield /></div>
                                <span>{t('insured')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-12 md:mt-0">
                        <div className="bg-white p-4 rounded-2xl shadow-xl">
                            {content.heroImage ? (
                                <img src={content.heroImage} alt="Hero" className="rounded-xl w-full h-64 md:h-80 object-cover" />
                            ) : (
                                <div className="bg-slate-100 rounded-xl w-full h-64 md:h-80 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-6xl">🧹</span>
                                        <p className="text-slate-400 mt-4">{t('professionalCleaningServices')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="bg-white py-16 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg transition border border-transparent hover:border-slate-100">
                                <div className="p-3 bg-white shadow rounded-lg text-blue-600">
                                    {iconMap[f.title] || <IconCheck />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{f.title}</h3>
                                    <p className="text-sm text-slate-500 mt-2">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Preview */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t('ourCleaningServices')}</h2>
                        <p className="text-slate-500 text-lg">{t('servicesPreviewIntro')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {servicesPreview.map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100">
                                <div className={`w-14 h-14 ${s.bgColor} ${s.textColor} rounded-2xl flex items-center justify-center mb-4 text-3xl`}>
                                    {s.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
                                <p className="text-slate-500 mb-4">{s.desc}</p>
                                <Link to="/services" className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1">
                                    {t('learnMore')} <IconArrowRight />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner Section with Images */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-blue-600 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 p-12 flex flex-col justify-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    {content.bannerSection?.title || 'Trusted by Schools & Businesses'}
                                </h2>
                                <p className="text-blue-100 text-lg mb-8">
                                    {content.bannerSection?.description || 'Over 500+ happy clients trust us with their cleaning needs.'}
                                </p>
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-white">500+</p>
                                        <p className="text-blue-200 text-sm">{t('happyClients')}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-white">50+</p>
                                        <p className="text-blue-200 text-sm">{t('schools')}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-4xl font-bold text-white">99%</p>
                                        <p className="text-blue-200 text-sm">{t('satisfaction')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 flex">
                                {content.bannerSection?.image1 ? (
                                    <img src={content.bannerSection.image1} alt="Banner 1" className="w-1/2 h-80 object-cover" />
                                ) : (
                                    <div className="w-1/2 h-80 bg-blue-500 flex items-center justify-center text-6xl">🧹</div>
                                )}
                                {content.bannerSection?.image2 ? (
                                    <img src={content.bannerSection.image2} alt="Banner 2" className="w-1/2 h-80 object-cover" />
                                ) : (
                                    <div className="w-1/2 h-80 bg-blue-400 flex items-center justify-center text-6xl">✨</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Banner */}
            <div className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white/10 rounded-2xl p-8">
                            <p className="text-5xl font-bold text-white mb-2">500+</p>
                            <p className="text-blue-100">{t('happyClients')}</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8">
                            <p className="text-5xl font-bold text-white mb-2">50+</p>
                            <p className="text-blue-100">{t('schoolsServed')}</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8">
                            <p className="text-5xl font-bold text-white mb-2">99%</p>
                            <p className="text-blue-100">{t('satisfaction')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t('ourSimpleProcess')}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {content.processSteps.map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('readyCleanerSpace')}</h2>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                        {t('getYourFreeQuote')}
                        <IconArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
