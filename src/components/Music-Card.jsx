import React, { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

function MusicCard({ id, item, isfavorites }) {
    const [duration, setDurations] = useState();
    const Navigate = useNavigate();
    useEffect(() => {
        const audio = new Audio(item.src);
        audio.addEventListener('loadedmetadata', () => {
            setDurations(audio.duration);
        });
    }, []);

    const handelClick = (d) => {
        Navigate(`../play/${d}`);
    };
    return (
        <div
            onClick={() => handelClick(item.id)}
            className='group cursor-pointer relative w-full bg-[#1a0b2f]/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-purple-400/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.03] transition-all duration-500'
        >
            <div className='relative w-full aspect-square overflow-hidden'>
                <img
                    src={item.cover}
                    alt={item.title}
                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                />

                <button className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <div className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-linear-to-tr from-[#a855f7] to-[#c084fc] hover:scale-110 transition-transform duration-300'>
                        <Play size={22} className='text-black' />
                    </div>
                </button>

                <div className='absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40'>
                    <Heart
                        size={18}
                        className={`${
                            isfavorites
                                ? 'text-pink-500 fill-pink-500'
                                : 'text-gray-300'
                        }`}
                    />
                </div>
            </div>

            <div className='p-3 sm:p-4 space-y-1'>
                <h2 className='text-sm sm:text-base font-medium truncate capitalize'>
                    {item.title.replace(/-/g, ' ')}
                </h2>
                <p className='text-xs sm:text-sm text-gray-400 truncate'>
                    {item.artist}
                </p>
                <div className='flex justify-between items-center mt-2 text-[11px] sm:text-xs text-gray-500'>
                    <span>Track #{item.id + 1}</span>
                    <span>{duration ? formatDuration(duration) : '00:00'}</span>
                </div>
            </div>

            {/* Bottom Glow Bar */}
            <div className='absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-[#a855f7] to-[#c084fc] opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
        </div>
    );
}

export default MusicCard;
