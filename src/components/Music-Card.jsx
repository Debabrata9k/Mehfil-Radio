// src/components/MusicCard.jsx
import { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';

function MusicCard({ item }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [duration, setDuration] = useState('--:--');

    // Load favorite status from localStorage (or you can use context later)
    useEffect(() => {
        const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favs.includes(item.id));
    }, [item.id]);

    // Toggle favorite and store in localStorage
    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorite((prev) => {
            const updated = !prev;
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const newFavs = updated
                ? [...favs, item.id]
                : favs.filter((id) => id !== item.id);
            localStorage.setItem('favorites', JSON.stringify(newFavs));
            return updated;
        });
    };

    // Auto calculate duration (if you have audio file)
    useEffect(() => {
        if (item.src) {
            const audio = new Audio(item.src);
            audio.addEventListener('loadedmetadata', () => {
                const total = audio.duration;
                const m = Math.floor(total / 60);
                const s = Math.floor(total % 60);
                setDuration(`${m}:${s < 10 ? '0' : ''}${s}`);
            });
        }
    }, [item.src]);

    const handlePlay = () => {
        navigate(`/play/${item.id}`);
    };

    return (
        <div
            onClick={handlePlay}
            className='group relative cursor-pointer bg-[#1a0b2f]/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:border-purple-400/40 hover:scale-[1.03] transition-all duration-500'
        >
            {/* Image */}
            <div className='relative w-full aspect-square overflow-hidden'>
                <img
                    src={item.cover}
                    alt={item.title}
                    className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'
                />

                {/* Play overlay */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                    <button className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-linear-to-tr from-purple-500 to-pink-400 hover:scale-110 transition-transform duration-300'>
                        <Play size={22} className='text-black' />
                    </button>
                </div>
            </div>

            {/* Favorite button */}
            <button
                onClick={handleToggleFavorite}
                className='absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-all duration-300'
            >
                <Heart
                    size={18}
                    className={`${
                        isFavorite
                            ? 'text-pink-500 fill-pink-500'
                            : 'text-gray-300'
                    } transition-colors duration-300`}
                />
            </button>

            {/* Info section */}
            <div className='p-3 sm:p-4 space-y-1'>
                <h2 className='text-sm sm:text-base font-medium truncate capitalize'>
                    {item.title.replace(/-/g, ' ')}
                </h2>
                <p className='text-xs sm:text-sm text-gray-400 truncate'>
                    {item.artist}
                </p>

                <div className='flex justify-between items-center mt-2 text-[11px] sm:text-xs text-gray-500'>
                    <span>Track #{item.id + 1}</span>
                    <span>{duration}</span>
                </div>
            </div>

            {/* Glow bar */}
            <div className='absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
        </div>
    );
}

export default MusicCard;
