import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useAdmin } from '../context/AdminContext';
import { getLanguageMeta, supportedLanguages, useLanguage } from '../context/LanguageContext';

const Settings = () => {
    const { user } = useAdmin();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [newPassword, setNewPassword] = useState('');
    const [newsletter, setNewsletter] = useState(true);
    const [quoteUpdates, setQuoteUpdates] = useState(true);
    const [saving, setSaving] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            if (!user?.uid) return;

            setDisplayName(user.displayName || '');

            try {
                const userSnap = await getDoc(doc(db, 'users', user.uid));
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setDisplayName(data.displayName || user.displayName || '');
                    setNewsletter(data.preferences?.newsletter ?? true);
                    setQuoteUpdates(data.preferences?.quoteUpdates ?? true);
                }
            } catch (error) {
                showMessage('Could not load your latest account settings.', 'error');
                console.error('Error loading account settings:', error);
            }
        };

        loadSettings();
    }, [user?.uid, user?.displayName]);

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 3500);
    };

    const handleUpdateProfile = async () => {
        if (!auth.currentUser || !user?.uid) return;

        try {
            setSaving('profile');
            await updateProfile(auth.currentUser, { displayName });
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                displayName,
                photoURL: auth.currentUser.photoURL || '',
                updatedAt: serverTimestamp(),
            }, { merge: true });
            showMessage('Profile updated and saved to Firebase.');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setSaving('');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            return;
        }
        try {
            setSaving('password');
            await updatePassword(auth.currentUser, newPassword);
            await setDoc(doc(db, 'users', user.uid), { passwordUpdatedAt: serverTimestamp() }, { merge: true });
            showMessage('Password changed in Firebase.');
            setNewPassword('');
        } catch (error) {
            const needsLogin = error.code === 'auth/requires-recent-login';
            showMessage(needsLogin ? 'Please log out and sign in again before changing your password.' : error.message, 'error');
        } finally {
            setSaving('');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    const handleLanguageChange = async (value) => {
        try {
            setSaving('language');
            await setLanguage(value);
            showMessage('Language preference saved.');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setSaving('');
        }
    };

    const handlePreferenceChange = async (key, value) => {
        if (!user?.uid) {
            showMessage('Please sign in before changing account settings.', 'error');
            return;
        }

        if (key === 'newsletter') setNewsletter(value);
        if (key === 'quoteUpdates') setQuoteUpdates(value);

        try {
            setSaving(key);
            await setDoc(doc(db, 'users', user.uid), {
                preferences: {
                    newsletter: key === 'newsletter' ? value : newsletter,
                    quoteUpdates: key === 'quoteUpdates' ? value : quoteUpdates,
                },
                updatedAt: serverTimestamp(),
            }, { merge: true });
            showMessage('Notification preference saved.');
        } catch (error) {
            if (key === 'newsletter') setNewsletter(!value);
            if (key === 'quoteUpdates') setQuoteUpdates(!value);
            showMessage(error.message, 'error');
        } finally {
            setSaving('');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-slate-800 mb-4">{t('settingsTitle')}</h1>
                    <p className="text-slate-600 mb-8">{t('settingsSignInHelp')}</p>
                    <button onClick={() => navigate('/login')} className="inline-flex bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        {t('signIn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">{t('settingsTitle')}</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg font-medium ${messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {message}
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === 'password' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        {t('password')}
                    </button>
                    <button
                        onClick={() => setActiveTab('language')}
                        className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === 'language' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        {t('language')}
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-6 py-3 rounded-lg font-bold transition ${activeTab === 'notifications' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                    >
                        {t('notifications')}
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('profileInfo')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('email')}</label>
                                <input
                                    type="email"
                                    disabled
                                    value={user?.email || ''}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('displayName')}</label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    placeholder={t('yourName')}
                                />
                            </div>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={saving === 'profile'}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                {saving === 'profile' ? 'Saving...' : t('updateProfile')}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('changePassword')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('newPassword')}</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                    placeholder={t('passwordHint')}
                                />
                            </div>
                            <button
                                onClick={handleChangePassword}
                                disabled={saving === 'password'}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                {saving === 'password' ? 'Saving...' : t('savePassword')}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'language' && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('languagePreference')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {supportedLanguages.map((code) => {
                                const option = getLanguageMeta(code);
                                return (
                                    <button
                                        key={code}
                                        onClick={() => handleLanguageChange(code)}
                                        className={`p-5 rounded-lg border-2 text-left transition ${language === code ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}
                                    >
                                        <p className="font-bold text-slate-800">{option.name}</p>
                                        <p className="text-sm text-slate-500 mt-1">{option.help}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('notificationPreferences')}</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-slate-800">{t('newsletter')}</p>
                                    <p className="text-sm text-slate-500">{t('newsletterHelp')}</p>
                                </div>
                                <button
                                    onClick={() => handlePreferenceChange('newsletter', !newsletter)}
                                    disabled={saving === 'newsletter'}
                                    className={`w-14 h-8 rounded-full transition ${newsletter ? 'bg-blue-600' : 'bg-slate-300'} relative`}
                                    aria-pressed={newsletter}
                                >
                                    <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${newsletter ? 'left-7' : 'left-1'}`}></span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-bold text-slate-800">{t('quoteUpdates')}</p>
                                    <p className="text-sm text-slate-500">{t('quoteUpdatesHelp')}</p>
                                </div>
                                <button
                                    onClick={() => handlePreferenceChange('quoteUpdates', !quoteUpdates)}
                                    disabled={saving === 'quoteUpdates'}
                                    className={`w-14 h-8 rounded-full transition ${quoteUpdates ? 'bg-blue-600' : 'bg-slate-300'} relative`}
                                    aria-pressed={quoteUpdates}
                                >
                                    <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${quoteUpdates ? 'left-7' : 'left-1'}`}></span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 bg-red-50 p-6 rounded-lg border border-red-100">
                    <h3 className="text-lg font-bold text-red-800 mb-2">{t('dangerZone')}</h3>
                    <p className="text-red-600 text-sm mb-4">{t('logoutHelp')}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        {t('logout')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
