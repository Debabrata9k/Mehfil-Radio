import React, { useEffect, useState } from 'react';
import MusicData from '../musicData';
import MusicCard from '../components/Music-Card';

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
}

function Explore() {
    const [durations, setDurations] = useState({});
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Load durations once
    useEffect(() => {
        MusicData.forEach((track) => {
            const audio = new Audio(track.src);
            audio.addEventListener('loadedmetadata', () => {
                setDurations((prev) => ({
                    ...prev,
                    [track.id]: formatDuration(audio.duration),
                }));
            });
        });
    }, []);

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            let updated;
            if (prev.includes(id)) {
                updated = prev.filter((favId) => favId !== id);
            } else {
                updated = [...prev, id];
            }
            localStorage.setItem('favorites', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <div className='relative w-full min-h-screen text-white overflow-hidden bg-linear-to-b from-[#0a0515] via-[#13052b] to-[#0a0515]'>
            {/* glowing background */}
            <div className='absolute inset-0 -z-10 overflow-hidden'>
                <div className='absolute top-[-200px] left-[-200px] w-[400px] h-[400px] bg-purple-600/20 blur-[100px] rounded-full'></div>
                <div className='absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-pink-600/20 blur-[90px] rounded-full'></div>
            </div>

            <div className='relative w-full h-full overflow-y-auto scroll-smooth px-4 sm:px-6 md:px-10 py-10'>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-purple-500 tracking-wide'>
                    Explore Music 🎵
                </h1>

                <div className='grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pb-20'>
                    {MusicData.map((item) => (
                        <MusicCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Explore;
