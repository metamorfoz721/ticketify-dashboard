import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets, getStats } from "../api";
import { HueSlider } from "../components/HueSlider";
import { SettingsDialog } from "../components/SettingsDialog";

interface Ticket {
    id: string;
    code: string;
    owner: string;
    eventName: string;
    packet: string | null;
    createdAt: number;
    lastScanned: number | null;
}

export const TicketListPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<{ total: number; scanned: number } | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketsRes, statsRes] = await Promise.all([
                    getTickets(),
                    getStats()
                ]);
                setTickets(ticketsRes.tickets);
                setStats(statsRes);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Biletler yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTickets = tickets.filter(t =>
        t.owner.toLowerCase().includes(search.toLowerCase()) ||
        t.code.includes(search)
    );

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <header className="px-4 pt-8 pb-4 sticky top-0 md:relative glass-header z-10 transition-all duration-300">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Bilet Havuzu</h1>
                                <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                                    {tickets.length} TOPLAM KAYIT
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest active:scale-95 transition-all"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                                </svg>
                            </button>
                            <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />
                        </div>
                        <div className="pt-1">
                            {/* HueSlider moved to settings */}
                        </div>
                    </div>

                    {stats && (
                        <div className="md3-card p-5 bg-surface-container-high mb-6 animate-slide-up">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">Okutma İlerlemesi</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-on-surface">{stats.scanned}</span>
                                    <span className="text-[10px] font-bold text-outline">/</span>
                                    <span className="text-[10px] font-bold text-outline">{stats.total}</span>
                                </div>
                            </div>
                            <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden shadow-inner p-0.5">
                                <div
                                    className="h-full bg-primary rounded-full progress-bar-fill shadow-[0_0_12px_oklch(var(--primary-oklch)/0.3)]"
                                    style={{ width: `${(stats.scanned / stats.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="İsim veya kod ile hızlı ara..."
                            className="md3-input pl-12 h-14"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-outline animate-pulse">BİLETLER YÜKLENİYOR</p>
                    </div>
                ) : error ? (
                    <div className="md3-card p-6 bg-error-container text-on-error-container text-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 mx-auto mb-3 opacity-50">
                            <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
                        </svg>
                        <p className="font-bold">{error}</p>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-20 h-20 mb-4">
                            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <p className="font-bold uppercase tracking-widest">Bilet Bulunamadı</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 pb-24">
                        {filteredTickets.map((ticket, index) => (
                            <Link
                                key={ticket.id}
                                to={`/tickets/${ticket.id}`}
                                className="md3-card p-5 group flex flex-col gap-3 active:scale-[0.98] transition-all animate-slide-up"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors tracking-tight">{ticket.owner}</span>
                                        <div className="flex items-center gap-2">
                                            {ticket.packet && (
                                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-wider">
                                                    {ticket.packet}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[11px] font-mono font-black bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-xl">
                                            {ticket.code}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-3 flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                                    <div className="flex items-center gap-2 text-outline">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5 opacity-40">
                                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" />
                                        </svg>
                                        <span>{new Date(ticket.createdAt * 1000).toLocaleDateString("tr-TR")}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${ticket.lastScanned ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${ticket.lastScanned ? "bg-emerald-600 animate-pulse" : "bg-amber-600"}`}></div>
                                        <span>
                                            {ticket.lastScanned
                                                ? `Okutuldu: ${new Date(ticket.lastScanned * 1000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`
                                                : "Bekliyor"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
