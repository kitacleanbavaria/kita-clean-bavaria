import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const quotesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuotes(quotesData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this quote request?')) {
            try {
                await deleteDoc(doc(db, 'quotes', id));
                fetchQuotes();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filteredQuotes = filter === 'all'
        ? quotes
        : quotes.filter(q => q.service === filter);

    const serviceTypes = [...new Set(quotes.map(q => q.service).filter(Boolean))];

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Quote Requests</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">Filter:</span>
                        <select
                            className="px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Services</option>
                            {serviceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchQuotes}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            🔄 Refresh
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
	                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
	                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Service</th>
	                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Details</th>
	                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredQuotes.map((quote) => (
                                <tr key={quote.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{quote.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{quote.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{quote.phone || '-'}</td>
                                    <td className="px-6 py-4">
	                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold capitalize">
	                                            {quote.service || 'General'}
	                                        </span>
	                                    </td>
	                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
	                                        {quote.serviceDetails?.length > 0 ? (
	                                            <div>
	                                                <p>{quote.serviceDetails.join(', ')}</p>
	                                                {quote.roomCount && <p className="text-slate-400 mt-1">{quote.roomCount}</p>}
	                                            </div>
	                                        ) : (
	                                            quote.roomCount || '-'
	                                        )}
	                                    </td>
	                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {quote.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(quote.id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredQuotes.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No quote requests found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminQuotes;
