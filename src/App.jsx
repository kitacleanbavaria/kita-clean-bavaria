import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Settings from './pages/Settings';
import MyQuotes from './pages/MyQuotes';
import Impressum from './pages/Impressum';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHomeEditor from './pages/admin/AdminHomeEditor';
import AdminServicesEditor from './pages/admin/AdminServicesEditor';
import AdminBlogManager from './pages/admin/AdminBlogManager';
import AdminContactEditor from './pages/admin/AdminContactEditor';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AdminProvider>
            <LanguageProvider>
                <Router>
                    <div className="min-h-screen bg-white font-sans text-slate-900">
                        <Navbar user={user} />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/quotes" element={<MyQuotes />} />
                                <Route path="/impressum" element={<Impressum />} />

                                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                                <Route path="/admin/home" element={<AdminRoute><AdminHomeEditor /></AdminRoute>} />
                                <Route path="/admin/services" element={<AdminRoute><AdminServicesEditor /></AdminRoute>} />
                                <Route path="/admin/blog" element={<AdminRoute><AdminBlogManager /></AdminRoute>} />
                                <Route path="/admin/contact" element={<AdminRoute><AdminContactEditor /></AdminRoute>} />
                                <Route path="/admin/quotes" element={<AdminRoute><AdminQuotes /></AdminRoute>} />
                                <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </LanguageProvider>
        </AdminProvider>
    );
}

export default App;
