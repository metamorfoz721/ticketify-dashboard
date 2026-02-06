import React from "react";
import { useTheme } from "../context/ThemeContext";

export const HueSlider: React.FC = () => {
    const { hue, setHue } = useTheme();

    return (
        <div className="flex flex-col gap-2 w-full max-w-[200px]">
            <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Renk Tonu</span>
                <span className="text-[10px] font-mono font-bold text-outline/60">{hue}°</span>
            </div>
            <div className="relative h-12 flex items-center group w-full">
                {/* Hue Gradient Track - Solid & Thick for Native feel */}
                <div className="absolute inset-x-0 h-4 my-auto hue-gradient rounded-full opacity-100 shadow-inner ring-1 ring-black/5"></div>

                {/* Actual Input Slider */}
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={hue}
                    onChange={(e) => setHue(parseInt(e.target.value, 10))}
                    className="relative w-full h-12 bg-transparent appearance-none cursor-pointer focus:outline-none z-10 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-8 
            [&::-webkit-slider-thumb]:h-8 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-[3px] 
            [&::-webkit-slider-thumb]:border-surface-variant 
            [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.2)] 
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:active:scale-110
            [&::-moz-range-thumb]:w-8 
            [&::-moz-range-thumb]:h-8 
            [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-[3px] 
            [&::-moz-range-thumb]:border-surface-variant 
            [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.2)]
            [&::-moz-range-thumb]:transition-transform
            [&::-moz-range-thumb]:active:scale-110
          "
                />
            </div>
        </div>
    );
};
