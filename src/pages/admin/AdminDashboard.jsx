import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from "../../context/AdminContext";
const AdminDashboard = () => {
    const { user } = useAdmin();

    const menuItems = [
        { path: '/admin/home', title: 'Home Editor', desc: 'Edit hero text, features, process steps', icon: '🏠', color: 'bg-blue-500' },
        { path: '/admin/services', title: 'Services Editor', desc: 'Update service cards, prices, descriptions', icon: '🧹', color: 'bg-green-500' },
        { path: '/admin/blog', title: 'Blog Manager', desc: 'Create, edit, delete blog posts', icon: '📝', color: 'bg-purple-500' },
        { path: '/admin/contact', title: 'Contact Editor', desc: 'Update company info, email, phone, address', icon: '📞', color: 'bg-orange-500' },
        { path: '/admin/quotes', title: 'Quote Requests', desc: 'View and manage customer quotes', icon: '📋', color: 'bg-pink-500' },
        { path: '/admin/users', title: 'User Management', desc: 'View registered users and admins', icon: '👥', color: 'bg-indigo-500' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
                    <p className="text-slate-600 mt-2">Welcome back, {user?.email}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, i) => (
                        <Link
                            key={i}
                            to={item.path}
                            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-slate-100 group"
                        >
                            <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;