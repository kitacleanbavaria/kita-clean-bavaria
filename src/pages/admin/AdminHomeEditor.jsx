import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminHomeEditor = () => {
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
        ],
        footer: {
            companyName: 'Isarkita',
            tagline: 'Professional cleaning for kindergartens, offices, and homes. Safe, reliable, and eco-friendly.',
            phone: '+49 123 456 789',
            email: 'info@isarkita.de',
            address: 'Munich, Germany',
            hours: 'Mon - Fri: 8:00 - 18:00',
            facebook: '',
            twitter: '',
            instagram: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const docRef = doc(db, 'siteContent', 'home');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setContent(prev => ({ ...prev, ...docSnap.data() }));
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'siteContent', 'home'), content);
            setMessage('✅ Home content saved!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        }
        setSaving(false);
    };

    const updateField = (field, value) => {
        setContent(prev => ({ ...prev, [field]: value }));
    };

    const updateFeature = (index, field, value) => {
        const newFeatures = [...content.features];
        newFeatures[index][field] = value;
        setContent(prev => ({ ...prev, features: newFeatures }));
    };

    const updateBanner = (field, value) => {
        setContent(prev => ({
            ...prev,
            bannerSection: { ...prev.bannerSection, [field]: value }
        }));
    };

    const updateProcessStep = (index, field, value) => {
        const newSteps = [...content.processSteps];
        newSteps[index][field] = value;
        setContent(prev => ({ ...prev, processSteps: newSteps }));
    };

    const updateFooter = (field, value) => {
        setContent(prev => ({
            ...prev,
            footer: { ...prev.footer, [field]: value }
        }));
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Home Page Editor</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
                        {message}
                    </div>
                )}

                {/* Hero Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">🎯 Hero Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.heroTitle}
                                onChange={(e) => updateField('heroTitle', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Subtitle (Tagline)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.heroSubtitle}
                                onChange={(e) => updateField('heroSubtitle', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Description</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.heroDescription}
                                onChange={(e) => updateField('heroDescription', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Hero Image URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="https://example.com/image.jpg"
                                value={content.heroImage}
                                onChange={(e) => updateField('heroImage', e.target.value)}
                            />
                            {content.heroImage && (
                                <img src={content.heroImage} alt="Hero Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.ctaButtonText}
                                onChange={(e) => updateField('ctaButtonText', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">⭐ Features</h2>
                    {content.features.map((feature, index) => (
                        <div key={index} className="mb-4 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-bold text-slate-700 mb-2">Feature #{index + 1}</h3>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 mb-2"
                                placeholder="Title"
                                value={feature.title}
                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                            />
                            <textarea
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                placeholder="Description"
                                value={feature.desc}
                                onChange={(e) => updateFeature(index, 'desc', e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Banner Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">🖼️ Banner Section</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200"
                                value={content.bannerSection.title}
                                onChange={(e) => updateBanner('title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Description</label>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200"
                                value={content.bannerSection.description}
                                onChange={(e) => updateBanner('description', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image 1 URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200"
                                placeholder="https://example.com/image1.jpg"
                                value={content.bannerSection.image1}
                                onChange={(e) => updateBanner('image1', e.target.value)}
                            />
                            {content.bannerSection.image1 && (
                                <img src={content.bannerSection.image1} alt="Banner 1" className="mt-4 w-full h-48 object-cover rounded-lg" />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image 2 URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200"
                                placeholder="https://example.com/image2.jpg"
                                value={content.bannerSection.image2}
                                onChange={(e) => updateBanner('image2', e.target.value)}
                            />
                            {content.bannerSection.image2 && (
                                <img src={content.bannerSection.image2} alt="Banner 2" className="mt-4 w-full h-48 object-cover rounded-lg" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Process Steps */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">📋 Process Steps</h2>
                    {content.processSteps.map((step, index) => (
                        <div key={index} className="mb-4 p-4 bg-slate-50 rounded-lg">
                            <h3 className="font-bold text-slate-700 mb-2">Step #{step.step}</h3>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 mb-2"
                                placeholder="Title"
                                value={step.title}
                                onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                            />
                            <textarea
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                placeholder="Description"
                                value={step.desc}
                                onChange={(e) => updateProcessStep(index, 'desc', e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">🦶 Footer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.companyName || ''}
                                onChange={(e) => updateFooter('companyName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.phone || ''}
                                onChange={(e) => updateFooter('phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.email || ''}
                                onChange={(e) => updateFooter('email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Business Hours</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.hours || ''}
                                onChange={(e) => updateFooter('hours', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Footer Tagline</label>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.tagline || ''}
                                onChange={(e) => updateFooter('tagline', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                            <textarea
                                rows={2}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={content.footer?.address || ''}
                                onChange={(e) => updateFooter('address', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="https://facebook.com/..."
                                value={content.footer?.facebook || ''}
                                onChange={(e) => updateFooter('facebook', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="https://instagram.com/..."
                                value={content.footer?.instagram || ''}
                                onChange={(e) => updateFooter('instagram', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Twitter URL</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="https://twitter.com/..."
                                value={content.footer?.twitter || ''}
                                onChange={(e) => updateFooter('twitter', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomeEditor;
