import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const MyQuotes = lazy(() => import('./pages/MyQuotes'));
const Impressum = lazy(() => import('./pages/Impressum'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHomeEditor = lazy(() => import('./pages/admin/AdminHomeEditor'));
const AdminServicesEditor = lazy(() => import('./pages/admin/AdminServicesEditor'));
const AdminBlogManager = lazy(() => import('./pages/admin/AdminBlogManager'));
const AdminContactEditor = lazy(() => import('./pages/admin/AdminContactEditor'));
const AdminQuotes = lazy(() => import('./pages/admin/AdminQuotes'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

const PageLoader = () => (
    <div className="min-h-[55vh] bg-white flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
    </div>
);

function App() {
    return (
        <AdminProvider>
            <LanguageProvider>
                <Router>
                    <div className="min-h-screen bg-white font-sans text-slate-900">
                        <Navbar />
                        <main>
                            <Suspense fallback={<PageLoader />}>
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
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </LanguageProvider>
        </AdminProvider>
    );
}

export default App;
