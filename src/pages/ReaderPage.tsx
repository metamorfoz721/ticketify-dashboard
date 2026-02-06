import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { TicketCodeInput } from "../components/TicketCodeInput";
import { TicketDetailsModal } from "../components/TicketDetailsModal";
import { scanTicket, validateTicket, getTicketDetails } from "../api";
import { useTheme } from "../context/ThemeContext";
import { SettingsDialog } from "../components/SettingsDialog";

type Mode = "qr" | "code";

export const ReaderPage: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<Mode>("qr");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"ok" | "error" | "info">("info");
  const [isScanning, setIsScanning] = useState(true);
  const [ticketData, setTicketData] = useState<{
    ticket: any;
    scanHistory: any[];
  } | null>(null);

  const { theme, toggleTheme } = useTheme();

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "code") {
      setIsScanning(false);
    } else {
      setIsScanning(true);
    }
  };

  const handleResult = async (code: string) => {
    setLoading(true);
    setMessage(null);
    setIsScanning(false);
    try {
      const digits = code.replace(/\D/g, "").slice(0, 8);
      const res = await validateTicket(digits);
      if (!res.valid || !res.ticket) {
        setStatus("error");
        setMessage("Bilet bulunamadı");
        return;
      }

      await scanTicket(res.ticket.id);
      const details = await getTicketDetails(res.ticket.id);

      setTicketData(details);
      setStatus("ok");
      setMessage(res.ticket.owner);
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Bir hata oluştu");
      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setTicketData(null);
    setIsScanning(true);
    setMessage(null);
    setStatus("info");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-hidden">
      <header className="px-5 pt-8 pb-5 flex flex-col gap-6 glass-header sticky top-0 z-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-on-surface truncate">Tarayıcı</h1>
            <p className="text-[9px] text-primary uppercase font-black tracking-[0.15em] mt-0.5 whitespace-nowrap">Sistem Aktif</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
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
            <div className="inline-flex rounded-[18px] bg-surface-variant p-1">
              <button
                className={`px-4 py-2 text-[10px] font-black rounded-[14px] transition-all uppercase tracking-wider ${mode === "qr"
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-105"
                  : "text-on-surface/50 hover:text-on-surface"
                  }`}
                onClick={() => handleModeSwitch("qr")}
              >
                QR
              </button>
              <button
                className={`px-4 py-2 text-[10px] font-black rounded-[14px] transition-all uppercase tracking-wider ${mode === "code"
                  ? "bg-primary text-on-primary shadow-md shadow-primary/20 scale-105"
                  : "text-on-surface/50 hover:text-on-surface"
                  }`}
                onClick={() => handleModeSwitch("code")}
              >
                KOD
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col items-center justify-start gap-4 max-w-sm mx-auto w-full">
        <section className="md3-card w-full py-5 px-5 flex flex-col items-center justify-center gap-4 overflow-hidden">
          {mode === "qr" ? (
            <div className="w-full aspect-square overflow-hidden rounded-[32px] bg-surface-container-highest relative">
              <Scanner
                constraints={{ facingMode: "environment" }}
                components={{
                  torch: true,
                  zoom: true,
                  finder: true,
                }}
                scanDelay={1500}
                paused={!isScanning || loading}
                onScan={(result) => {
                  const text = Array.isArray(result)
                    ? result[0]?.rawValue ?? ""
                    : (result as any)?.[0]?.rawValue ?? "";
                  if (isScanning && !loading && text) {
                    void handleResult(text);
                  }
                }}
              />
              {!isScanning && (
                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center flex-col gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7 opacity-40">
                      <path d="M10 9l-6 6m0-6l6 6m5-6h6m-6 3h6m-6 3h6" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-black text-outline uppercase tracking-[0.2em] opacity-60">TARAMA DURDURULDU</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              <TicketCodeInput onSubmit={handleResult} loading={loading} />
            </div>
          )}

          {mode === "qr" && (
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`w-full h-14 rounded-[22px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 ${isScanning
                ? "bg-error-container text-on-error-container"
                : "bg-primary text-on-primary"
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-error animate-pulse" : "bg-on-primary"}`}></div>
              {isScanning ? "Durdur" : "Bilet Tara"}
            </button>
          )}
        </section>
      </main>

      {ticketData && (
        <TicketDetailsModal
          ticket={{
            ...ticketData.ticket,
            code: ticketData.ticket.code || ""
          }}
          scanHistory={ticketData.scanHistory}
          onClose={closeDetails}
        />
      )}

      {/* Full-screen result overlay */}
      {(loading || (message && !ticketData)) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-surface rounded-[32px] w-full max-w-sm p-8 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300 shadow-2xl">
            {loading ? (
              <>
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-on-surface">İşleniyor...</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold mt-2">Bilet doğrulanıyor</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 rounded-full bg-error flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-12 h-12">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-on-surface">{message}</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-[0.2em] font-bold mt-2">Bilet doğrulanamadı</p>
                </div>
                <button
                  onClick={() => { setMessage(null); setStatus("info"); setIsScanning(true); }}
                  className="md3-button-primary w-full h-14 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                >
                  Tekrar Dene
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
