import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { IconMenu, IconClose } from './Icons';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [headerData, setHeaderData] = useState({
        logoText: 'Kita Clean',
        logoSubtext: 'BAVARIA',
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

    useEffect(() => {
        setIsOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    const linkStyle = (path) => {
        const active = isActive(path);
        return active
            ? 'text-[#8edee5] font-bold bg-white/10 px-4 py-2 rounded-full'
            : 'text-slate-200 hover:text-white px-4 py-2 rounded-full hover:bg-white/10';
    };

    const quoteHref = '/contact';

    return (
        <nav className="bg-black sticky top-0 z-50 border-b border-[#168ee9]/25 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="min-w-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="min-w-0 flex items-center gap-2 sm:gap-3">
                            {headerData.logoImageUrl ? (
                                <img src={headerData.logoImageUrl} alt="Logo" className="w-12 h-12 object-contain shrink-0" />
                            ) : (
                                <div className="w-11 h-11 bg-white/10 text-[#8edee5] rounded-lg shadow-sm flex items-center justify-center font-serif text-xl">
                                    K
                                </div>
                            )}
                            <div className="min-w-0 flex flex-col">
                                <div className="flex items-baseline gap-1">
                                    <div className="truncate text-lg sm:text-xl font-bold tracking-tight text-white">{headerData.logoText}</div>
                                    <span className="text-[10px] font-bold tracking-[0.18em] text-[#8edee5] uppercase">{headerData.logoSubtext}</span>
                                </div>
                                {headerData.tagline && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="h-px w-4 bg-white/20"></span>
                                        <p className="text-xs text-slate-400">{headerData.tagline}</p>
                                        <span className="h-px w-4 bg-white/20"></span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="hidden xl:flex items-center space-x-2">
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
                                    <span className="text-sm font-medium text-slate-700">Customer Portal</span>
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
                            <Link to="/login" className="text-slate-200 hover:text-white px-4 py-2 rounded-full hover:bg-white/10 font-semibold ml-4">
                                Customer Portal
                            </Link>
                        )}
                        <Link to={quoteHref} className="bg-[#8edee5] text-[#102b3f] px-6 py-2.5 rounded-lg font-bold hover:bg-[#b4edf1] transition shadow-lg shadow-slate-950/20">
                            {headerData.ctaButton}
                        </Link>
                    </div>

                    <div className="xl:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-[#8edee5] min-h-11 min-w-11 p-3"
                            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <IconClose /> : <IconMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <>
                <button
                    type="button"
                    className="fixed inset-x-0 bottom-0 top-20 z-0 bg-black/35 xl:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                />
                <div className="relative z-10 xl:hidden bg-black border-t border-[#168ee9]/25 shadow-2xl">
                    <div className="px-4 pt-2 pb-4">
                        <Link to="/" className={`block px-4 py-3 rounded-xl ${isActive('/') ? 'text-[#8edee5] bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'}`} onClick={() => setIsOpen(false)}>{t('home')}</Link>
                        <Link to="/services" className={`block px-4 py-3 rounded-xl ${isActive('/services') ? 'text-[#8edee5] bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'}`} onClick={() => setIsOpen(false)}>{t('services')}</Link>
                        <Link to="/blog" className={`block px-4 py-3 rounded-xl ${isActive('/blog') ? 'text-[#8edee5] bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'}`} onClick={() => setIsOpen(false)}>{t('blog')}</Link>
                        <Link to="/contact" className={`block px-4 py-3 rounded-xl ${isActive('/contact') ? 'text-[#8edee5] bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'}`} onClick={() => setIsOpen(false)}>{t('contact')}</Link>

                        {user && (
                            <>
                                <div className="border-t border-white/10 my-2"></div>
                                <div className="px-4 py-2 text-sm font-bold text-[#8edee5]">Customer Portal</div>
                                <div className="px-4 py-2 text-sm text-slate-400 break-all">{t('signedInAs')} {user.email}</div>
                                <Link to="/quotes" className="block px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>{t('myQuotes')}</Link>
                                <Link to="/services" className="block px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>{t('bookService')}</Link>
                                <Link to="/settings" className="block px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>{t('accountSettings')}</Link>

                                {/* ADMIN PANEL LINK - MOBILE */}
                                {isAdmin && (
                                    <Link to="/admin" className="block px-4 py-3 rounded-xl text-purple-600 hover:bg-purple-50 font-bold" onClick={() => setIsOpen(false)}>{t('adminPanel')}</Link>
                                )}

                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full min-h-11 text-left px-4 py-3 rounded-xl text-red-300 hover:bg-white/10">{t('logout')}</button>
                            </>
                        )}

                        {!user && (
                            <>
                                <div className="border-t border-white/10 my-2"></div>
                                <Link to="/login" className="block px-4 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 font-semibold" onClick={() => setIsOpen(false)}>Customer Portal</Link>
                                <Link to={quoteHref} className="block px-4 py-3 rounded-xl text-[#102b3f] bg-[#8edee5] text-center mt-2 font-bold" onClick={() => setIsOpen(false)}>{headerData.ctaButton}</Link>
                            </>
                        )}
                    </div>
                </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
