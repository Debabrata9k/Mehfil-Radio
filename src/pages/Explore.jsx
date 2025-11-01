import React, { useEffect, useState } from 'react';
import MusicData from '../musicData';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';
function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}
function Explore() {
    const [durations, setDurations] = useState({});
    const Navigate = useNavigate();

    // ⏳ Load duration for each music file automatically
    useEffect(() => {
        MusicData.forEach((track) => {
            const audio = new Audio(track.src);
            audio.addEventListener('loadedmetadata', () => {
                setDurations((prev) => ({
                    ...prev,
                    [track.id]: audio.duration,
                }));
            });
        });
    }, []);

    const handelClick = (d) => {
        Navigate(`../play/${d}`);
    };
    return (
        <div className='relative w-full h-screen text-white overflow-hidden bg-linear-to-b from-[#0a0515] via-[#13052b] to-[#0a0515]'>
            {/* Scrollable Container */}
            <div className='relative w-full h-full overflow-y-auto scroll-smooth px-4 sm:px-6 md:px-10 py-10'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-purple-400 tracking-wide'>
                    Explore Music
                </h1>

                {/* Grid of Music Cards */}
                <div className='pb-20 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                    {MusicData.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handelClick(item.id)}
                            className='group cursor-pointer relative w-full  bg-[#1a0b2f]/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-purple-400/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.03] transition-all duration-500'
                        >
                            <div className='relative w-full aspect-square overflow-hidden'>
                                <img
                                    src={item.cover}
                                    alt={item.title}
                                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                                />

                                <button className='absolute inset-0 flex items-center justify-center  bg-black/40 opacity-0 group-hover:opacity-100  transition-opacity duration-500'>
                                    <div className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-linear-to-tr from-[#a855f7] to-[#c084fc] hover:scale-110 transition-transform duration-300'>
                                        <Play
                                            size={22}
                                            className='text-black'
                                        />
                                    </div>
                                </button>
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
                                    <span>
                                        {durations[item.id]
                                            ? formatDuration(durations[item.id])
                                            : '00:00'}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Glow Bar */}
                            <div className='absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-[#a855f7] to-[#c084fc] opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Explore;
