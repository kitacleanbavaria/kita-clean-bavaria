import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const usersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const toggleAdmin = async (userId, currentRole) => {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await updateDoc(doc(db, 'users', userId), {
                role: newRole
            });
            fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">User Management</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">User ID</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Joined</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{user.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => toggleAdmin(user.id, user.role)}
                                            className={`font-medium text-sm ${user.role === 'admin'
                                                    ? 'text-orange-500 hover:text-orange-700'
                                                    : 'text-blue-600 hover:text-blue-800'
                                                }`}
                                        >
                                            {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No registered users yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;