import React from 'react';
import { useNavigate } from 'react-router-dom';

const Impressum = () => {
    const navigate = useNavigate();

    const closeImpressum = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="relative bg-white border border-slate-100 rounded-lg shadow-sm p-8 md:p-10">
                    <button
                        type="button"
                        onClick={closeImpressum}
                        className="absolute top-5 right-5 w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-[#102b3f] hover:border-[#8edee5] hover:bg-[#f2fafb] transition flex items-center justify-center text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-[#55bbc8] focus:ring-offset-2"
                        aria-label="Impressum schließen"
                        title="Schließen"
                    >
                        ×
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-8 pr-14">Impressum</h1>

                    <section className="space-y-3 text-slate-700">
                        <h2 className="text-xl font-bold text-slate-900">Angaben gemaess § 5 DDG</h2>
                        <p>
                            Kitaclean Bavaria<br />
                            Inhaber: Daniel Farivar<br />
                            Muenchener Strasse 26a<br />
                            85540 Haar<br />
                            Deutschland
                        </p>
                    </section>

                    <section className="space-y-3 text-slate-700 mt-8">
                        <h2 className="text-xl font-bold text-slate-900">Kontakt</h2>
                        <p>
                            Telefon: <a className="text-blue-600 hover:text-blue-800 font-medium" href="tel:+4915774882545">+49 1577 4882545</a><br />
                            E-Mail: <a className="text-blue-600 hover:text-blue-800 font-medium" href="mailto:kitacleanbavaria@gmail.com">kitacleanbavaria@gmail.com</a>
                        </p>
                    </section>

                    <section className="space-y-3 text-slate-700 mt-8">
                        <h2 className="text-xl font-bold text-slate-900">Verantwortlich fuer den Inhalt</h2>
                        <p>
                            Daniel Farivar<br />
                            Muenchener Strasse 26a<br />
                            85540 Haar<br />
                            Deutschland
                        </p>
                    </section>

                    <section className="space-y-3 text-slate-700 mt-8">
                        <h2 className="text-xl font-bold text-slate-900">Haftung fuer Inhalte</h2>
                        <p>
                            Als Diensteanbieter sind wir fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
                            Wir sind jedoch nicht verpflichtet, uebermittelte oder gespeicherte fremde Informationen zu ueberwachen oder nach
                            Umstaenden zu forschen, die auf eine rechtswidrige Taetigkeit hinweisen.
                        </p>
                    </section>

                    <section className="space-y-3 text-slate-700 mt-8">
                        <h2 className="text-xl font-bold text-slate-900">Haftung fuer Links</h2>
                        <p>
                            Unser Angebot kann Links zu externen Webseiten Dritter enthalten, auf deren Inhalte wir keinen Einfluss haben.
                            Fuer diese fremden Inhalte koennen wir keine Gewaehr uebernehmen. Fuer die Inhalte der verlinkten Seiten ist stets
                            der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Impressum;
