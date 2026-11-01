import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { IconArrowRight, IconCalendar, IconCheck, IconLeaf, IconShield, IconUsers } from '../components/Icons';

const defaults = {
    heroTitle: 'Saubere Kitas. Sichere Räume. Jeden Tag.',
    heroSubtitle: 'Spezialisierte Kita-Reinigung in München & Umgebung',
    heroDescription: 'Zuverlässige Unterhaltsreinigung mit einem geschulten Team, klaren Abläufen und besonderem Blick für sensible Bereiche.',
    heroImage: '',
    ctaButtonText: 'Kostenloses Angebot anfragen',
    features: [
        { title: 'Kindgerechte Reinigung', desc: 'Sorgfältig ausgewählte Mittel für sensible Kita-Bereiche.' },
        { title: 'Verlässlich geplant', desc: 'Feste Abläufe, transparente Kommunikation, klare Zuständigkeiten.' },
        { title: 'Flexible Zeiten', desc: 'Reinigung passend zu Ihrem Kita-Alltag und Ihren Öffnungszeiten.' },
        { title: 'Geschultes Team', desc: 'Sorgfalt und Diskretion bei jedem einzelnen Einsatz.' }
    ],
    processSteps: [
        { step: '01', title: 'Kennenlernen', desc: 'Sie schildern uns kurz Ihre Räume und Anforderungen.' },
        { step: '02', title: 'Vor-Ort-Termin', desc: 'Wir prüfen Flächen, Rhythmus und sensible Bereiche.' },
        { step: '03', title: 'Ihr Plan', desc: 'Sie erhalten ein klares, individuelles Angebot.' },
        { step: '04', title: 'Sauber starten', desc: 'Unser Team übernimmt zuverlässig zum vereinbarten Termin.' }
    ]
};

const serviceCards = [
    { number: '01', title: 'Kita & Kindergarten', desc: 'Hygienische Gruppenräume, Sanitärbereiche, Flure und Spielflächen – abgestimmt auf Ihren Tagesablauf.', accent: 'lime' },
    { number: '02', title: 'Büro & Verwaltung', desc: 'Gepflegte Arbeitsplätze und Gemeinschaftsflächen für ein professionelles Umfeld.', accent: 'blue' },
    { number: '03', title: 'Grund- & Sonderreinigung', desc: 'Intensive Reinigung bei Übergaben, Ferienzeiten oder besonderem Bedarf.', accent: 'sand' }
];

const Home = () => {
    const [content, setContent] = useState(defaults);
    const [loading, setLoading] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [sliderPaused, setSliderPaused] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const snap = await getDoc(doc(db, 'siteContent', 'home'));
                if (snap.exists()) setContent(prev => ({ ...prev, ...snap.data() }));
            } catch (error) {
                console.error('Error fetching home content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const heroSlides = [...new Set([
        content.heroImage,
        content.bannerSection?.image1,
        content.bannerSection?.image2
    ].filter(Boolean))];

    useEffect(() => {
        if (sliderPaused || heroSlides.length < 2) return undefined;
        const interval = window.setInterval(() => {
            setActiveSlide(current => (current + 1) % heroSlides.length);
        }, 5000);
        return () => window.clearInterval(interval);
    }, [heroSlides.length, sliderPaused]);

    useEffect(() => {
        if (activeSlide >= heroSlides.length) setActiveSlide(0);
    }, [activeSlide, heroSlides.length]);

    const icons = [<IconLeaf />, <IconShield />, <IconCalendar />, <IconUsers />];
    if (loading) return <div className="site-loader" aria-label="Loading"><span /></div>;

    return (
        <main className="premium-home">
            <section className="hero-premium">
                <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
                <div className="site-shell hero-grid">
                    <div className="hero-copy">
                        <p className="eyebrow"><span /> {content.heroSubtitle}</p>
                        <h1>{content.heroTitle}</h1>
                        <p className="hero-lead">{content.heroDescription}</p>
                        <div className="hero-actions">
                            <Link to="/contact" className="premium-button premium-button-primary">{content.ctaButtonText}<IconArrowRight /></Link>
                            <Link to="/services" className="premium-button premium-button-ghost">Leistungen ansehen</Link>
                        </div>
                        <div className="hero-assurance"><span><IconCheck /> Unverbindliche Anfrage</span><span><IconCheck /> Persönliche Betreuung</span></div>
                    </div>
                    <div
                        className="hero-visual"
                        aria-label="Professionelle Kita-Reinigung"
                        onMouseEnter={() => setSliderPaused(true)}
                        onMouseLeave={() => setSliderPaused(false)}
                        onFocus={() => setSliderPaused(true)}
                        onBlur={() => setSliderPaused(false)}
                    >
                        {heroSlides.length ? <div className="hero-slides">
                            {heroSlides.map((image, index) => (
                                <img
                                    key={image}
                                    src={image}
                                    alt={`Professionelle Kita-Reinigung – Ansicht ${index + 1}`}
                                    className={index === activeSlide ? 'active' : ''}
                                    aria-hidden={index !== activeSlide}
                                />
                            ))}
                        </div> : (
                            <div className="clean-scene"><div className="scene-window"><i /><i /><i /></div><div className="scene-surface"><span /><span /><span /></div><div className="scene-shine shine-one">✦</div><div className="scene-shine shine-two">✦</div></div>
                        )}
                        {heroSlides.length > 1 && <div className="slider-controls" aria-label="Hero-Bilder auswählen">
                            {heroSlides.map((image, index) => (
                                <button
                                    type="button"
                                    key={image}
                                    className={index === activeSlide ? 'active' : ''}
                                    onClick={() => setActiveSlide(index)}
                                    aria-label={`Bild ${index + 1} anzeigen`}
                                    aria-current={index === activeSlide ? 'true' : undefined}
                                />
                            ))}
                        </div>}
                        <div className="visual-note"><span className="note-icon"><IconShield /></span><span><strong>Sorgfältig bis ins Detail</strong><small>Für Räume, in denen Kinder wachsen</small></span></div>
                    </div>
                </div>
            </section>

            <section className="trust-strip"><div className="site-shell trust-grid">
                {(content.features || defaults.features).slice(0, 4).map((feature, index) => (
                    <article className="trust-item" key={`${feature.title}-${index}`}><span className="trust-icon">{icons[index]}</span><div><h3>{feature.title}</h3><p>{feature.desc}</p></div></article>
                ))}
            </div></section>

            <section className="premium-section services-premium"><div className="site-shell">
                <div className="section-heading split-heading"><div><p className="eyebrow dark"><span /> Unsere Leistungen</p><h2>Reinigung, die zu Ihren Räumen passt.</h2></div><p>Kein Standardpaket von der Stange. Wir schauen genau hin und entwickeln einen Ablauf, der im Alltag wirklich funktioniert.</p></div>
                <div className="premium-service-grid">{serviceCards.map(card => (
                    <article className={`premium-service-card accent-${card.accent}`} key={card.number}><span className="service-number">{card.number}</span><div className="service-rule" /><h3>{card.title}</h3><p>{card.desc}</p><Link to="/services" aria-label={`${card.title} mehr erfahren`}>Mehr erfahren <IconArrowRight /></Link></article>
                ))}</div>
            </div></section>

            <section className="premium-section why-section"><div className="site-shell why-grid">
                <div className="why-panel"><p className="why-kicker">Kita Clean Standard</p><blockquote>„Sauberkeit soll man nicht nur sehen. Man soll sich auf sie verlassen können.“</blockquote><div className="why-badge"><IconLeaf /><span>Bewusst reinigen<br/><small>Verantwortungsvoll handeln</small></span></div></div>
                <div className="why-copy"><p className="eyebrow dark"><span /> Warum Kita Clean</p><h2>Verlässlichkeit beginnt mit klaren Abläufen.</h2><p>Gerade in Einrichtungen für Kinder zählt mehr als ein sauberer Eindruck. Deshalb verbinden wir gründliche Arbeit mit verbindlicher Planung und direkter Kommunikation.</p><ul>
                    <li><IconCheck /><span><strong>Feste Ansprechpartner</strong>Kurze Wege und persönliche Betreuung.</span></li>
                    <li><IconCheck /><span><strong>Individuelle Reinigungspläne</strong>Auf Räume, Nutzung und Rhythmus abgestimmt.</span></li>
                    <li><IconCheck /><span><strong>Qualität mit Blick fürs Detail</strong>Damit sensible Bereiche zuverlässig gepflegt sind.</span></li>
                </ul></div>
            </div></section>

            <section className="premium-section process-premium"><div className="site-shell">
                <div className="section-heading centered-heading"><p className="eyebrow dark"><span /> So starten wir</p><h2>In vier Schritten zu sauberen Räumen.</h2></div>
                <div className="process-grid">{(content.processSteps || defaults.processSteps).map((item, index) => (
                    <article className="process-card" key={`${item.step}-${index}`}><span>{String(item.step).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.desc}</p></article>
                ))}</div>
            </div></section>

            <section className="premium-cta"><div className="site-shell cta-inner"><div><p className="eyebrow"><span /> Bereit für den nächsten Schritt?</p><h2>Lassen Sie uns über Ihre Räume sprechen.</h2><p>Unverbindlich anfragen. Persönlich beraten lassen. Klarheit bekommen.</p></div><Link to="/contact" className="premium-button premium-button-light">Angebot anfragen <IconArrowRight /></Link></div></section>
        </main>
    );
};

export default Home;
