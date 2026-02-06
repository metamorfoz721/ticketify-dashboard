import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketDetails } from "../api";

export const TicketDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [ticketData, setTicketData] = useState<{
        ticket: any;
        scanHistory: any[];
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const data = await getTicketDetails(id);
                setTicketData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Bilet bilgileri yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-outline font-bold tracking-widest uppercase">Yükleniyor...</p>
            </div>
        );
    }

    if (error || !ticketData) {
        return (
            <div className="min-h-screen p-6 bg-surface flex flex-col items-center justify-center">
                <div className="md3-card p-8 text-center bg-error/5 border-error/20 border">
                    <p className="text-error font-bold mb-4">{error || "Bilet bulunamadı"}</p>
                    <button onClick={() => navigate("/tickets")} className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold">Listeye Dön</button>
                </div>
            </div>
        );
    }

    const { ticket, scanHistory } = ticketData;
    const recentScans = scanHistory.slice(0, 5);

    return (
        <div className="min-h-screen flex flex-col bg-surface pb-24">
            <header className="px-4 pt-6 pb-4 sticky top-0 bg-surface/80 backdrop-blur-lg z-10 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold tracking-tight">Bilet Detayı</h1>
            </header>

            <main className="px-4 flex flex-col gap-6">
                <section className="md3-card p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32">
                            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 7a4 4 0 100-8 4 4 0 000 8z" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold italic mb-4 uppercase tracking-tight">{ticket.owner}</h2>

                    <div className="bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl font-mono text-lg font-black text-primary tracking-widest italic">
                        {ticket.code}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black text-outline uppercase tracking-[0.2em] mb-4 px-1">Tarama Geçmişi</h3>
                    {recentScans.length === 0 ? (
                        <div className="md3-card p-8 border-dashed flex flex-col items-center justify-center opacity-40">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-2">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                            <p className="font-bold text-xs">Henüz okutulmadı</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentScans.map((scan, i) => (
                                <div key={scan.id} className="md3-card p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xs">
                                            {recentScans.length - i}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{new Date(scan.scannedAt * 1000).toLocaleTimeString("tr-TR")}</span>
                                            <span className="text-[10px] font-black text-outline uppercase tracking-wider">{new Date(scan.scannedAt * 1000).toLocaleDateString("tr-TR")}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-outline uppercase tracking-tighter mb-0.5">OKUTAN GÖREVLİ</p>
                                        <p className="text-xs font-bold">{scan.readerName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
