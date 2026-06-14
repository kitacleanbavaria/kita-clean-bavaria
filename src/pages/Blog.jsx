import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IconArrowRight, IconCalendar, IconClock } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brokenImages, setBrokenImages] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const fallbackPosts = [
        { id: '1', title: "The Ultimate Guide to a Healthier Kindergarten", category: "Hygiene", date: "May 15, 2025", readTime: "6 min read", excerpt: "Discover essential cleaning practices for safer learning environments." },
        { id: '2', title: "5 Eco-Friendly Cleaning Products That Actually Work", category: "Eco-Tips", date: "May 10, 2025", readTime: "4 min read", excerpt: "Natural solutions that are safe for children and effective against germs." },
        { id: '3', title: "Why Deep Cleaning Matters More Than You Think", category: "Deep Clean", date: "May 5, 2025", readTime: "5 min read", excerpt: "Regular deep cleaning prevents illness and extends the life of your facilities." },
        { id: '4', title: "Preparing Your Office for Flu Season", category: "Health", date: "Apr 28, 2025", readTime: "3 min read", excerpt: "Protect your employees with these preventive cleaning measures." },
    ];

    const displayPosts = posts.length > 0 ? posts : fallbackPosts;

    const categoryColors = {
        'Hygiene': 'bg-green-100 text-green-700',
        'Eco-Tips': 'bg-blue-100 text-blue-700',
        'Deep Clean': 'bg-purple-100 text-purple-700',
        'Health': 'bg-orange-100 text-orange-700',
        'Child Safety': 'bg-pink-100 text-pink-700'
    };

    const fallbackIcons = ['📚', '🌿', '✨', '🏥'];

    const getPostImageUrl = (post) => {
        const imageUrl = post.imageUrl?.trim();
        return imageUrl && !brokenImages[post.id] ? imageUrl : '';
    };

    const getPostContent = (post) => {
        return post.content || post.excerpt || 'More details for this article will be added soon.';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">{t('blogTitle')}</h1>
                    <p className="text-blue-100 text-lg">{t('blogIntro')}</p>
                </div>
            </div>

            {/* Blog Posts */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {displayPosts.map((post, index) => {
                            const postImageUrl = getPostImageUrl(post);
                            const imageHeight = index === 0 ? 'h-64 md:h-80' : 'h-52';

                            return (
                            <div key={post.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-100 ${index === 0 ? 'md:col-span-2' : ''}`}>
                                <div className={`${imageHeight} bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center overflow-hidden`}>
                                    {postImageUrl ? (
                                        <img
                                            src={postImageUrl}
                                            alt={post.title || 'Blog post image'}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                            onError={() => setBrokenImages(prev => ({ ...prev, [post.id]: true }))}
                                        />
                                    ) : (
                                        <span className="text-4xl">{fallbackIcons[index % fallbackIcons.length]}</span>
                                    )}
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <IconCalendar />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <IconClock />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <span className={`${categoryColors[post.category] || 'bg-slate-100 text-slate-700'} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                                        {post.category}
                                    </span>
                                    <h3 className={`font-bold text-slate-800 mt-3 mb-3 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-500">{post.excerpt}</p>
                                    <button
                                        onClick={() => setSelectedPost(post)}
                                        className="text-blue-600 font-bold mt-4 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        {t('readMore')}
                                        <IconArrowRight />
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {selectedPost && (
                <div className="fixed inset-0 z-50 bg-slate-900/70 px-4 py-6 overflow-y-auto">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {getPostImageUrl(selectedPost) && (
                            <img
                                src={getPostImageUrl(selectedPost)}
                                alt={selectedPost.title || 'Blog post image'}
                                className="w-full h-64 md:h-80 object-cover"
                            />
                        )}
                        <article className="p-6 md:p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1">
                                    <IconCalendar />
                                    {selectedPost.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <IconClock />
                                    {selectedPost.readTime}
                                </span>
                                <span className={`${categoryColors[selectedPost.category] || 'bg-slate-100 text-slate-700'} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                                    {selectedPost.category}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                                {selectedPost.title}
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-7">
                                {getPostContent(selectedPost).split('\n').filter(Boolean).map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                            >
                                {t('cancel')}
                            </button>
                        </article>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;
