import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, removeToken } from "../api";
import { SettingsDialog } from "../components/SettingsDialog";

interface ProfileData {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    stats: {
        totalScans: number;
        recentScans: {
            scannedAt: number;
            owner: string;
            eventName: string;
        }[];
    };
}

export const ReaderProfilePage: React.FC = () => {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProfile();
                setData(res);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Profil yüklenemedi");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    if (loading)
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em]">Yükleniyor</p>
                </div>
            </div>
        );

    if (error || !data)
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-4">
                <div className="md3-card p-8 text-center max-w-sm w-full">
                    <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-error">
                            <path d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 14c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-sm font-bold text-error">{error ?? "Profil bulunamadı"}</p>
                </div>
            </div>
        );

    const { user, stats } = data;

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            {/* Header */}
            <header className="px-5 pt-10 pb-12 bg-primary-container rounded-b-[40px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-64 h-64 absolute -right-12 -top-12 text-on-primary-container">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary text-4xl font-black border-4 border-on-primary-container/10 shadow-lg shadow-primary/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-tight text-on-primary-container">{user.name}</h1>
                        <p className="text-sm text-on-primary-container/60 font-medium mt-0.5">{user.email}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container border border-primary/15">
                        {user.role === "admin" ? "Yönetici" : "Okuyucu"}
                    </span>
                </div>
            </header>

            <main className="flex-1 px-4 -mt-6 pb-24 flex flex-col gap-4 max-w-lg mx-auto w-full">
                {/* Stats */}
                <section className="md3-card p-6 flex justify-around">
                    <div className="flex flex-col items-center gap-1 border-r border-outline/10 pr-10">
                        <span className="text-3xl font-black text-primary">
                            {stats.totalScans}
                        </span>
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em]">
                            Toplam Okutma
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 pl-10">
                        <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            {stats.recentScans.length}
                        </span>
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.15em]">
                            Son Oturum
                        </span>
                    </div>
                </section>

                {/* Recent Scans */}
                <section className="md3-card p-6 flex flex-col gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant">Son Okutmalar</h2>
                    <div className="flex flex-col gap-2">
                        {stats.recentScans.length === 0 ? (
                            <div className="py-8 flex flex-col items-center gap-3 opacity-30">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                                    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm8 6h2v2h-2v-2zM9 11h2v2H9v-2zm4-4h2v2h-2V7zm-4 0h2v2H9V7z" />
                                </svg>
                                <p className="text-xs font-black uppercase tracking-widest text-center">Henüz bilet okutulmadı</p>
                            </div>
                        ) : (
                            stats.recentScans.slice(0, 5).map((scan, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center p-4 bg-surface-container rounded-[20px] border border-outline/5"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-black text-on-surface">{scan.owner}</span>
                                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                                            {scan.eventName}
                                        </span>
                                    </div>
                                    <div className="text-right flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black text-primary">
                                            {new Date(scan.scannedAt * 1000).toLocaleTimeString("tr-TR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        <span className="text-[9px] font-bold text-on-surface-variant/60">
                                            {new Date(scan.scannedAt * 1000).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Actions */}
                <section className="flex flex-col gap-3">
                    {/* Settings */}
                    <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-4 p-5 md3-card hover:bg-surface-container-high active:scale-[0.98] transition-all"
                    >
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-sm font-black text-on-surface">Görünüm Ayarları</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Tema ve renk ayarları</span>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-on-surface-variant/40 ml-auto">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                    <SettingsDialog isOpen={showSettings} onClose={() => setShowSettings(false)} />

                    {/* User Management (admin only) */}
                    {user.role === "admin" && (
                        <Link
                            to="/users"
                            className="flex items-center gap-4 p-5 md3-card hover:bg-surface-container-high active:scale-[0.98] transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-sm font-black text-on-surface">Kullanıcı Yönetimi</span>
                                <span className="text-[10px] text-on-surface-variant font-medium">Ekip üyelerini yönet</span>
                            </div>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-on-surface-variant/40 ml-auto">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 p-5 md3-card hover:bg-error/5 active:scale-[0.98] transition-all mt-2"
                    >
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9" />
                            </svg>
                        </div>
                        <span className="text-sm font-black text-error">Çıkış Yap</span>
                    </button>
                </section>
            </main>
        </div>
    );
};
