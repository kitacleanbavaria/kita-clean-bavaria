import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const iconOptions = [
    { value: '🏫', label: '🏫 School' },
    { value: '🏢', label: '🏢 Office' },
    { value: '✨', label: '✨ Sparkle' },
    { value: '🪟', label: '🪟 Window' },
    { value: '🧹', label: '🧹 Broom' },
    { value: '🧽', label: '🧽 Sponge' },
    { value: '🧼', label: '🧼 Soap' },
    { value: '🏠', label: '🏠 Home' },
    { value: '🏥', label: '🏥 Hospital' },
    { value: '🚗', label: '🚗 Car' },
    { value: '🌿', label: '🌿 Eco' },
    { value: '🔥', label: '🔥 Fire' },
    { value: '💧', label: '💧 Water' },
    { value: '🧴', label: '🧴 Sanitizer' },
    { value: '🪣', label: '🪣 Bucket' }
];

const colorOptions = [
    { value: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-600', label: 'Blue' },
    { value: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600', label: 'Green' },
    { value: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-600', label: 'Purple' },
    { value: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-600', label: 'Orange' },
    { value: 'red', bgColor: 'bg-red-50', textColor: 'text-red-600', label: 'Red' },
    { value: 'teal', bgColor: 'bg-teal-50', textColor: 'text-teal-600', label: 'Teal' },
    { value: 'pink', bgColor: 'bg-pink-50', textColor: 'text-pink-600', label: 'Pink' },
    { value: 'indigo', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600', label: 'Indigo' },
];

const AdminServicesEditor = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'siteContent', 'services');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const items = data.items || [];
                // Convert old format (color string) to new format (bgColor + textColor)
                const normalizedItems = items.map((item, index) => {
                    if (item.color && !item.bgColor) {
                        const colors = item.color.split(' ');
                        return {
                            ...item,
                            id: item.id || String(Date.now() + index),
                            bgColor: colors[0] || 'bg-blue-50',
                            textColor: colors[1] || 'text-blue-600',
                        };
                    }
                    return {
                        ...item,
                        id: item.id || String(Date.now() + index)
                    };
                });
                setServices(normalizedItems);
            } else {
                // No data in Firebase, use defaults
                setDefaultServices();
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching services:', error);
            setDefaultServices();
            setLoading(false);
        }
    };

    const setDefaultServices = () => {
        setServices([
            { id: '1', title: 'Kindergarten & Childcare', desc: 'Specialized cleaning protocols for toys, play areas, and classrooms using non-toxic products.', price: 'From €150/visit', bgColor: 'bg-blue-50', textColor: 'text-blue-600', icon: '🏫' },
            { id: '2', title: 'Office & Commercial', desc: 'Regular maintenance and deep cleaning for offices, retail spaces, and commercial buildings.', price: 'From €200/visit', bgColor: 'bg-green-50', textColor: 'text-green-600', icon: '🏢' },
            { id: '3', title: 'Residential Cleaning', desc: 'Home cleaning services including kitchens, bathrooms, and living areas.', price: 'From €80/visit', bgColor: 'bg-purple-50', textColor: 'text-purple-600', icon: '🏠' },
            { id: '4', title: 'Deep Disinfection', desc: 'Medical-grade disinfection services for high-risk areas or post-illness recovery.', price: 'Custom Quote', bgColor: 'bg-red-50', textColor: 'text-red-600', icon: '✨' },
            { id: '5', title: 'Carpet & Upholstery', desc: 'Steam cleaning and stain removal for carpets, rugs, and furniture.', price: 'From €50/room', bgColor: 'bg-orange-50', textColor: 'text-orange-600', icon: '🧹' },
            { id: '6', title: 'Window & Facade', desc: 'Interior and exterior window cleaning for a crystal-clear view.', price: 'From €100', bgColor: 'bg-teal-50', textColor: 'text-teal-600', icon: '🪟' },
        ]);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            // Make sure all services have proper IDs before saving
            const servicesToSave = services.map((s, index) => ({
                ...s,
                id: s.id || `service-${Date.now()}-${index}`
            }));

            await setDoc(doc(db, 'siteContent', 'services'), { items: servicesToSave });
            setMessage('✅ Services saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setMessage('❌ Error: ' + error.message);
        }
        setSaving(false);
    };

    const updateService = (index, field, value) => {
        const newServices = [...services];
        newServices[index] = {
            ...newServices[index],
            [field]: value
        };
        setServices(newServices);
    };

    const updateColor = (index, colorValue) => {
        const colorOption = colorOptions.find(c => c.value === colorValue);
        if (colorOption) {
            const newServices = [...services];
            newServices[index] = {
                ...newServices[index],
                bgColor: colorOption.bgColor,
                textColor: colorOption.textColor
            };
            setServices(newServices);
        }
    };

    const addService = () => {
        const newService = {
            id: `service-${Date.now()}`,
            title: 'New Service',
            desc: 'Description here...',
            price: 'From €0',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            icon: '🧹'
        };
        setServices(prev => [...prev, newService]);
    };

    const removeService = (index) => {
        const newServices = services.filter((_, i) => i !== index);
        setServices(newServices);
    };

    const getColorValue = (bgColor) => {
        const option = colorOptions.find(c => c.bgColor === bgColor);
        return option ? option.value : 'blue';
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Services Editor ({services.length} services)</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={addService}
                            className="bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                        >
                            ➕ Add Service
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : '💾 Save'}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
                        {message}
                    </div>
                )}

                {services.length === 0 && (
                    <div className="bg-yellow-50 p-6 rounded-lg text-yellow-800 mb-6">
                        No services found. Click "Add Service" to create one.
                    </div>
                )}

                {services.map((service, index) => (
                    <div key={service.id || index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{service.icon}</span>
                                <h3 className="text-lg font-bold text-slate-800">Service #{index + 1} - {service.title}</h3>
                            </div>
                            <button
                                onClick={() => removeService(index)}
                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                                🗑️ Remove
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={service.title}
                                    onChange={(e) => updateService(index, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={service.price}
                                    onChange={(e) => updateService(index, 'price', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={service.desc}
                                    onChange={(e) => updateService(index, 'desc', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
                                <select
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={service.icon || '🧹'}
                                    onChange={(e) => updateService(index, 'icon', e.target.value)}
                                >
                                    {iconOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Color Theme</label>
                                <select
                                    className="w-full px-3 py-2 rounded border border-slate-200 focus:border-blue-500 outline-none"
                                    value={getColorValue(service.bgColor)}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                >
                                    {colorOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminServicesEditor;