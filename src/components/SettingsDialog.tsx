import React from "react";
import { useTheme } from "../context/ThemeContext";
import { HueSlider } from "./HueSlider";

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="bg-surface-container-high w-full max-w-sm rounded-[28px] p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-on-surface">Görünüm Ayarları</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest hover:bg-surface-variant text-on-surface-variant transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Theme Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface-container rounded-[20px]">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface">Karanlık Mod</span>
                            <span className="text-[10px] text-on-surface-variant">Koyu tema kullan</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 relative ${theme === 'dark' ? 'bg-primary' : 'bg-surface-variant'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                        </button>
                    </div>

                    {/* Hue Slider Section */}
                    <div className="flex flex-col gap-3 p-4 bg-surface-container rounded-[20px]">
                        {/* Re-using simplified custom HueSlider */}
                        <HueSlider />
                    </div>
                </div>
            </div>
        </div>
    );
};
