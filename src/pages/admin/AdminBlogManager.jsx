import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminBlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        category: 'Hygiene',
        content: '',
        excerpt: '',
        readTime: '5 min read',
        imageUrl: '',
        image: 'bg-blue-100'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'blogPosts'));
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateDoc(doc(db, 'blogPosts', editing), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setMessage('✅ Post updated!');
            } else {
                await addDoc(collection(db, 'blogPosts'), {
                    ...formData,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    createdAt: serverTimestamp()
                });
                setMessage('✅ Post created!');
            }
            setFormData({
                title: '',
                category: 'Hygiene',
                content: '',
                excerpt: '',
                readTime: '5 min read',
                imageUrl: '',
                image: 'bg-blue-100'
            });
            setEditing(null);
            fetchPosts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error: ' + error.message);
        }
    };

    const handleEdit = (post) => {
        setEditing(post.id);
        setFormData({
            title: post.title,
            category: post.category,
            content: post.content || '',
            excerpt: post.excerpt || post.desc || '',
            readTime: post.readTime,
            imageUrl: post.imageUrl || '',
            image: post.image || 'bg-blue-100'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'blogPosts', id));
                setMessage('🗑️ Post deleted!');
                fetchPosts();
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('❌ Error: ' + error.message);
            }
        }
    };

    const cancelEdit = () => {
        setEditing(null);
        setFormData({
            title: '',
            category: 'Hygiene',
            content: '',
            excerpt: '',
            readTime: '5 min read',
            imageUrl: '',
            image: 'bg-blue-100'
        });
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Blog Manager</h1>

                {message && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
                        {message}
                    </div>
                )}

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        {editing ? '✏️ Edit Post' : '➕ Create New Post'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text" required
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Hygiene</option>
                                    <option>Eco-Tips</option>
                                    <option>Deep Clean</option>
                                    <option>Health</option>
                                    <option>Child Safety</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt / Short Description</label>
                            <input
                                type="text" required
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Content</label>
                            <textarea
                                rows={6}
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write the full blog post content here..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Read Time</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>
                        {formData.imageUrl && (
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Image Preview:</p>
                                <img src={formData.imageUrl} alt="Preview" className="w-48 h-32 object-cover rounded-lg" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fallback Color (if no image)</label>
                            <select
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            >
                                <option value="bg-blue-100">Blue</option>
                                <option value="bg-green-100">Green</option>
                                <option value="bg-purple-100">Purple</option>
                                <option value="bg-orange-100">Orange</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                            >
                                {editing ? '💾 Update Post' : '➕ Create Post'}
                            </button>
                            {editing && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-400 transition"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Image</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        {post.imageUrl ? (
                                            <img src={post.imageUrl} alt="" className="w-16 h-12 object-cover rounded" />
                                        ) : (
                                            <div className={`w-16 h-12 ${post.image || 'bg-blue-100'} rounded`}></div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{post.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{post.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{post.date}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {posts.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No blog posts yet. Create your first one above!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBlogManager;