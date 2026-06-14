import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    service: '',
    serviceDetails: [],
    roomCount: '',
    message: '',
};

const quoteOptions = {
    kindergarten: {
        detailLabel: 'Kindergarten areas',
        sizeLabel: 'How many rooms or areas?',
        details: ['Classrooms / group rooms', 'Toilets and washrooms', 'Play areas', 'Kitchen or dining area', 'Entrance and hallway', 'Whole kindergarten'],
        sizes: ['1-2 rooms', '3-5 rooms', '6-10 rooms', 'More than 10 rooms']
    },
    office: {
        detailLabel: 'Office sections',
        sizeLabel: 'How many office rooms or sections?',
        details: ['Individual office rooms', 'Whole office', 'Meeting rooms', 'Kitchen / break room', 'Reception area', 'Toilets and washrooms'],
        sizes: ['Small office', 'Medium office', 'Large office', 'Multiple floors']
    },
    residential: {
        detailLabel: 'Home areas',
        sizeLabel: 'Home size',
        details: ['Kitchen', 'Bathroom', 'Bedrooms', 'Living room', 'Windows', 'Whole home'],
        sizes: ['Studio / 1 room', '2-3 rooms', '4-5 rooms', 'Large home']
    },
    deep: {
        detailLabel: 'Deep cleaning type',
        sizeLabel: 'Approximate size',
        details: ['Office deep cleaning', 'School / kindergarten deep cleaning', 'Carpet deep cleaning', 'Kitchen deep cleaning', 'Bathroom deep cleaning', 'Post-renovation cleaning'],
        sizes: ['Small area', 'Medium area', 'Large area', 'Multiple rooms / sections']
    }
};

const MyQuotes = () => {
    const { user } = useAdmin();
    const { t } = useLanguage();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const quotesRef = collection(db, 'quotes');
                const lookups = [
                    query(quotesRef, where('userId', '==', user.uid)),
                    query(quotesRef, where('userEmail', '==', user.email)),
                    query(quotesRef, where('email', '==', user.email)),
                ];
                const snapshots = await Promise.all(lookups.map((lookup) => getDocs(lookup)));
                const byId = new Map();

                snapshots.forEach((snapshot) => {
                    snapshot.docs.forEach((quoteDoc) => {
                        byId.set(quoteDoc.id, { id: quoteDoc.id, ...quoteDoc.data() });
                    });
                });

                const quotesData = [...byId.values()].sort((a, b) => {
                    const aTime = a.createdAt?.toMillis?.() || Date.parse(a.createdAt || '') || 0;
                    const bTime = b.createdAt?.toMillis?.() || Date.parse(b.createdAt || '') || 0;
                    return bTime - aTime;
                });

                setQuotes(quotesData);
            } catch (error) {
                setMessage('Unable to load your quotes right now.');
                console.error('Error loading quotes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
    }, [user]);

    const startEdit = (quote) => {
        setEditingId(quote.id);
        setFormData({
            name: quote.name || '',
            email: quote.email || user?.email || '',
            phone: quote.phone || '',
            service: quote.service || '',
            serviceDetails: quote.serviceDetails || [],
            roomCount: quote.roomCount || '',
            message: quote.message || '',
        });
        setMessage('');
    };

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

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            await updateDoc(doc(db, 'quotes', editingId), {
                ...formData,
                userId: user.uid,
                userEmail: user.email,
                updatedAt: serverTimestamp(),
            });

            setQuotes((prev) => prev.map((quote) => (
                quote.id === editingId ? { ...quote, ...formData, userId: user.uid, userEmail: user.email } : quote
            )));
            setMessage('Quote updated successfully.');
            cancelEdit();
        } catch (error) {
            setMessage('Could not update this quote. Please try again.');
            console.error('Error updating quote:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">My Quotes</h1>
                    <p className="text-slate-600 mb-8">{t('signInToQuotes')}</p>
                    <Link to="/login" className="inline-flex bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        {t('signIn')}
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">{t('myQuotes')}</h1>
                        <p className="text-slate-500 mt-2">{t('quoteIntro')}</p>
                    </div>
                    <Link to="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition text-center">
                        {t('requestNewQuote')}
                    </Link>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                        {message}
                    </div>
                )}

                {quotes.length === 0 ? (
                    <div className="bg-white rounded-lg p-10 text-center border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-2">{t('noQuotes')}</h2>
                        <p className="text-slate-500 mb-6">{t('noQuotesHelp')}</p>
                        <Link to="/contact" className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                            {t('getFirstQuote')}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {quotes.map((quote) => (
                            <div key={quote.id} className="bg-white rounded-lg p-6 border border-slate-100 shadow-sm">
                                {editingId === quote.id ? (
                                    <form onSubmit={handleUpdate} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input required className="px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            <input required type="email" className="px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder={t('email')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                            <input className="px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                                            <select
                                                className="px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                                value={formData.service}
                                                onChange={(e) => setFormData({ ...formData, service: e.target.value, serviceDetails: [], roomCount: '' })}
                                            >
                                                <option value="">{t('selectService')}</option>
                                                <option value="kindergarten">Kindergarten Cleaning</option>
                                                <option value="office">Office Cleaning</option>
                                                <option value="residential">Residential Cleaning</option>
                                                <option value="deep">Deep Cleaning</option>
                                            </select>
                                        </div>
                                        {selectedQuoteOptions && (
                                            <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-3">{selectedQuoteOptions.detailLabel}</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {selectedQuoteOptions.details.map((detail) => (
                                                            <label key={detail} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 border border-blue-100 text-sm font-medium text-slate-700">
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
                                                        className="w-full px-4 py-3 rounded-lg border border-blue-100 focus:border-blue-500 outline-none bg-white"
                                                        value={formData.roomCount}
                                                        onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                                                    >
                                                        <option value="">Select size...</option>
                                                        {selectedQuoteOptions.sizes.map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none" placeholder={t('message')} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                                        <div className="flex flex-wrap gap-3">
                                            <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-blue-700 transition">{t('saveChanges')}</button>
                                            <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-200 transition">{t('cancel')}</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold capitalize">
                                                        {quote.service || t('general')}
                                                    </span>
                                                    <span className="text-sm text-slate-400">
                                                        {quote.createdAt?.toDate?.().toLocaleDateString() || t('recentlySubmitted')}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl font-bold text-slate-800">{quote.name || 'Quote Request'}</h2>
                                                <p className="text-slate-500 mt-1">{quote.email}</p>
                                                {quote.phone && <p className="text-slate-500">{quote.phone}</p>}
                                            </div>
                                            <button onClick={() => startEdit(quote)} className="bg-slate-900 text-white px-5 py-3 rounded-lg font-bold hover:bg-slate-800 transition">
                                                {t('editQuote')}
                                            </button>
                                        </div>
                                        {quote.message && (
                                            <p className="mt-5 text-slate-600 bg-slate-50 rounded-xl p-4">{quote.message}</p>
                                        )}
                                        {(quote.serviceDetails?.length > 0 || quote.roomCount) && (
                                            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
                                                {quote.serviceDetails?.length > 0 && (
                                                    <p><span className="font-bold">Selected areas:</span> {quote.serviceDetails.join(', ')}</p>
                                                )}
                                                {quote.roomCount && (
                                                    <p className="mt-1"><span className="font-bold">Size:</span> {quote.roomCount}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyQuotes;
