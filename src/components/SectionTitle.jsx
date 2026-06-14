import React from 'react';

const SectionTitle = ({ title, subtitle, centered = true }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}
    <div className={`h-1.5 w-20 bg-blue-500 rounded-full mt-4 ${centered ? 'mx-auto' : ''}`}></div>
  </div>
);

export default SectionTitle;