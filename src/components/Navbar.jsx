import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { IconStar, IconMenu, IconClose } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [headerData, setHeaderData] = useState({
        logoText: 'Isarkita',
        logoSubtext: 'REINIGUNG',
        tagline: '',
        logoImageUrl: '',
        phoneNumber: '+49 123 456 789',
        ctaButton: 'Get Free Quote'
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAdmin } = useAdmin();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchHeader = async () => {
            try {
                const [{ doc, getDoc }, { db }] = await Promise.all([
                    import('firebase/firestore'),
                    import('../firebase/config'),
                ]);
                const docRef = doc(db, 'siteContent', 'home');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().header) {
                    setHeaderData(prev => ({ ...prev, ...docSnap.data().header }));
                }
            } catch (error) {
                console.error('Error fetching header:', error);
            }
        };
        fetchHeader();
    }, []);

    const handleLogout = async () => {
        try {
            const [{ signOut }, { auth }] = await Promise.all([
                import('firebase/auth'),
                import('../firebase/config'),
            ]);
            await signOut(auth);
            setDropdownOpen(false);
            setIsOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const getUserName = () => {
        if (!user) return '';
        if (user.displayName) {
            return user.displayName.split(' ')[0];
        }
        return user.email?.split('@')[0] || 'User';
    };

    const getAvatarLetter = () => {
        const name = getUserName();
        return name.charAt(0).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const linkStyle = (path) => {
        const active = isActive(path);
        return active
            ? 'text-blue-700 font-bold bg-blue-100 px-4 py-2 rounded-full'
            : 'text-slate-600 hover:text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50';
    };

    const quoteHref = user ? '/contact' : '/login?redirect=/contact';

    return (
        <nav className="bg-blue-50 shadow-md sticky top-0 z-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex items-center gap-3">
                            {headerData.logoImageUrl ? (
                                <img src={headerData.logoImageUrl} alt="Logo" className="w-12 h-12 rounded-full" />
                            ) : (
                                <div className="bg-yellow-400 p-2.5 rounded-full shadow-sm">
                                    <IconStar />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <div className="text-2xl font-bold text-slate-800">{headerData.logoText}</div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase">{headerData.logoSubtext}</span>
                                </div>
                                {headerData.tagline && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="h-px w-4 bg-gray-300"></span>
                                        <p className="text-xs text-gray-400">{headerData.tagline}</p>
                                        <span className="h-px w-4 bg-gray-300"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={linkStyle('/')}>{t('home')}</Link>
                        <Link to="/services" className={linkStyle('/services')}>{t('services')}</Link>
                        <Link to="/blog" className={linkStyle('/blog')}>{t('blog')}</Link>
                        <Link to="/contact" className={linkStyle('/contact')}>{t('contact')}</Link>

                        {user ? (
                            <div className="user-dropdown relative ml-4">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-200"
                                >
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        {getAvatarLetter()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{getUserName()}</span>
                                    <span>▼</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-blue-50">
                                            <p className="text-sm font-bold text-slate-800">{getUserName()}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link to="/quotes" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">{t('myQuotes')}</Link>
                                            <Link to="/services" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">{t('bookService')}</Link>
                                            <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">{t('accountSettings')}</Link>
                                            <div className="border-t border-slate-100 my-1"></div>

                                            {/* ADMIN PANEL LINK - ONLY SHOWS IF isAdmin IS TRUE */}
                                            {isAdmin && (
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-bold">
                                                    {t('adminPanel')}
                                                </Link>
                                            )}

                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">{t('logout')}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4">
                                <Link to="/login" className="text-slate-600 hover:text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 font-semibold">
                                    {t('signIn')}
                                </Link>
                                <Link to={quoteHref} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg">
                                    {headerData.ctaButton}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-blue-600 p-2"
                            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <IconClose /> : <IconMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-blue-50 border-t border-blue-200">
                    <div className="px-4 pt-2 pb-4">
                        <Link to="/" className={`block px-4 py-3 rounded-xl ${isActive('/') ? 'text-blue-700 bg-blue-100' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`} onClick={() => setIsOpen(false)}>{t('home')}</Link>
                        <Link to="/services" className={`block px-4 py-3 rounded-xl ${isActive('/services') ? 'text-blue-700 bg-blue-100' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`} onClick={() => setIsOpen(false)}>{t('services')}</Link>
                        <Link to="/blog" className={`block px-4 py-3 rounded-xl ${isActive('/blog') ? 'text-blue-700 bg-blue-100' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`} onClick={() => setIsOpen(false)}>{t('blog')}</Link>
                        <Link to="/contact" className={`block px-4 py-3 rounded-xl ${isActive('/contact') ? 'text-blue-700 bg-blue-100' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`} onClick={() => setIsOpen(false)}>{t('contact')}</Link>

                        {user && (
                            <>
                                <div className="border-t border-blue-200 my-2"></div>
                                <div className="px-4 py-2 text-sm text-slate-500">{t('signedInAs')} {user.email}</div>
                                <Link to="/quotes" className="block px-4 py-3 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>{t('myQuotes')}</Link>
                                <Link to="/services" className="block px-4 py-3 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>{t('bookService')}</Link>
                                <Link to="/settings" className="block px-4 py-3 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => setIsOpen(false)}>{t('accountSettings')}</Link>

                                {/* ADMIN PANEL LINK - MOBILE */}
                                {isAdmin && (
                                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-purple-600 hover:bg-purple-50 font-bold" onClick={() => setIsOpen(false)}>{t('adminPanel')}</Link>
                                )}

                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">{t('logout')}</button>
                            </>
                        )}

                        {!user && (
                            <>
                                <div className="border-t border-blue-200 my-2"></div>
                                <Link to="/login" className="block px-4 py-3 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-semibold" onClick={() => setIsOpen(false)}>{t('signIn')}</Link>
                                <Link to={quoteHref} className="block px-4 py-3 rounded-xl text-blue-600 bg-white text-center mt-2 font-bold border border-blue-100" onClick={() => setIsOpen(false)}>{headerData.ctaButton}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
