import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminContactEditor = () => {
    const [info, setInfo] = useState({
        companyName: 'Isarkita Reinigung',
        phone: '+49 123 456 789',
        email: 'info@isarkita.de',
        address: 'Munich, Bavaria, Germany',
        hours: 'Mon - Fri: 8:00 - 18:00',
        facebook: '',
        twitter: '',
        instagram: '',
        whatsapp: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            const docRef = doc(db, 'siteContent', 'contact');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setInfo(prev => ({ ...prev, ...docSnap.data() }));
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
            await setDoc(doc(db, 'siteContent', 'contact'), info);
            setMessage('✅ Contact info saved!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        }
        setSaving(false);
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Contact Info Editor</h1>
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

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={info.companyName}
                                onChange={(e) => setInfo({ ...info, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={info.phone}
                                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={info.email}
                                onChange={(e) => setInfo({ ...info, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Business Hours</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={info.hours}
                                onChange={(e) => setInfo({ ...info, hours: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Address</label>
                        <textarea
                            rows={2}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                            value={info.address}
                            onChange={(e) => setInfo({ ...info, address: e.target.value })}
                        />
                    </div>
                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Social Media & WhatsApp</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={info.facebook}
                                    onChange={(e) => setInfo({ ...info, facebook: e.target.value })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Twitter URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={info.twitter}
                                    onChange={(e) => setInfo({ ...info, twitter: e.target.value })}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={info.instagram}
                                    onChange={(e) => setInfo({ ...info, instagram: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    value={info.whatsapp}
                                    onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
                                    placeholder="+49 123 456 789"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContactEditor;