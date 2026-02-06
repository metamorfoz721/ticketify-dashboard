import React from "react";

interface ScanRecord {
    id: string;
    scannedAt: number;
    readerName: string;
}

interface Ticket {
    id: string;
    code: string;
    owner: string;
    eventName: string;
    packet: string | null;
    createdAt: number;
}

interface Props {
    ticket: Ticket;
    scanHistory: ScanRecord[];
    onClose: () => void;
}

export const TicketDetailsModal: React.FC<Props> = ({ ticket, scanHistory, onClose }) => {
    const recentScans = scanHistory.slice(0, 5);
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 z-99">
            <div
                className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
            >
                {/* Header */}
                <div className="p-8 pb-6 flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-on-surface">{ticket.owner}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full">Sistem Kayıtlı</span>
                        </div>
                    </div>
                    <div className="bg-surface-variant text-on-surface px-4 py-1.5 rounded-2xl text-xs font-mono font-black border border-outline/10 shadow-sm">
                        {ticket.code}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="px-8 grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-primary/5 p-5 rounded-[24px] border border-primary/10">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-primary/60 block mb-2">Paket Türü</span>
                        <span className="font-extrabold text-sm text-on-surface">{ticket.packet || "Standart"}</span>
                    </div>
                    <div className="bg-primary/5 p-5 rounded-[24px] border border-primary/10">
                        <span className="text-[9px] uppercase tracking-[0.2em] font-black text-primary/60 block mb-2">Toplam Okutma</span>
                        <span className="font-black text-2xl text-primary">{scanHistory.length}</span>
                    </div>
                </div>

                {/* Scan History List */}
                <div className="px-8 flex-1 overflow-y-auto pb-8 scrollbar-hide">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-outline/50 mb-4">Son Taramalar</h3>
                    <div className="space-y-3">
                        {recentScans.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-30">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12">
                                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-bold uppercase tracking-widest text-center">Henüz tarama yok</p>
                            </div>
                        ) : (
                            recentScans.map((scan) => (
                                <div key={scan.id} className="flex justify-between items-center p-4 bg-surface-variant/30 rounded-[20px] border border-outline/5 hover:bg-surface-variant/50 transition-all group">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{scan.readerName}</span>
                                        <span className="text-[9px] font-bold text-outline uppercase tracking-wider">Yetkili Okuyucu</span>
                                    </div>
                                    <div className="text-right flex flex-col gap-0.5">
                                        <span className="text-[10px] font-black text-primary">
                                            {new Date(scan.scannedAt * 1000).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span className="text-[9px] font-bold text-outline opacity-60">
                                            {new Date(scan.scannedAt * 1000).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Action */}
                <div className="p-8 pt-4">
                    <button
                        onClick={onClose}
                        className="md3-button-primary w-full h-14 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                    >
                        Pencereyi Kapat
                    </button>
                </div>
            </div>
        </div>
    );
};
