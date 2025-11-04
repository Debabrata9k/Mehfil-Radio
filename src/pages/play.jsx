import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import musicData from '../musicData';
import MarqueeTitle from '../components/MarqueeTitle';
import {
    Play as PlayIcon,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    Heart,
} from 'lucide-react';

function Play() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentIndex = Number(id);

    const [musicIndex, setMusicIndex] = useState(currentIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [musicTotalLength, setMusicTotalLength] = useState('00:00');
    const [musicCurrentTime, setMusicCurrentTime] = useState('00:00');
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [previousIndex, setPreviousIndex] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const currentAudio = useRef(null);

    const [currentMusicDetails, setCurrentMusicDetails] = useState({
        title: musicData[musicIndex].title,
        artist: musicData[musicIndex].artist,
        src: musicData[musicIndex].src,
        cover: musicData[musicIndex].cover,
    });

    const isFavorite = favorites.includes(musicIndex);

    // 🟣 Sync song when URL id changes (browser navigation)
    useEffect(() => {
        const index = Number(id);
        if (index < 0 || index >= musicData.length) return;
        setMusicIndex(index);
        const song = musicData[index];
        setCurrentMusicDetails({
            title: song.title,
            artist: song.artist,
            src: song.src,
            cover: song.cover,
        });
    }, [id]);

    // 🟣 Load audio and autoplay on song change
    useEffect(() => {
        const audio = currentAudio.current;
        if (!audio) return;

        audio.pause();
        audio.src = currentMusicDetails.src;
        audio.load();

        const onReady = () => {
            audio
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        };

        audio.addEventListener('loadedmetadata', onReady);
        return () => audio.removeEventListener('loadedmetadata', onReady);
    }, [currentMusicDetails.src]);

    // 🎚️ Time and progress updates
    const handleAudioUpdate = () => {
        const audio = currentAudio.current;
        if (!audio || !audio.duration) return;

        const format = (n) => (n < 10 ? `0${n}` : n);
        const duration = audio.duration;
        const current = audio.currentTime;

        setMusicTotalLength(
            `${format(Math.floor(duration / 60))}:${format(
                Math.floor(duration % 60)
            )}`
        );
        setMusicCurrentTime(
            `${format(Math.floor(current / 60))}:${format(
                Math.floor(current % 60)
            )}`
        );

        const progress = (current / duration) * 100;
        setAudioProgress(isNaN(progress) ? 0 : progress);
    };

    // ▶️ / ⏸️ Play Pause toggle
    const handleAudioPlay = () => {
        const audio = currentAudio.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    // ⏩ Seek bar
    const handleMusicProgressBar = (e) => {
        const value = Number(e.target.value);
        const audio = currentAudio.current;
        if (!audio) return;
        const seekTime = (value / 100) * audio.duration;
        if (!isNaN(seekTime)) audio.currentTime = seekTime;
        setAudioProgress(value);
    };

    // 🔀 Shuffle random
    const getRandomIndex = () => {
        let randomIndex = Math.floor(Math.random() * musicData.length);
        while (randomIndex === musicIndex && musicData.length > 1) {
            randomIndex = Math.floor(Math.random() * musicData.length);
        }
        return randomIndex;
    };

    // ⏭️ Next Song
    const handleNextSong = () => {
        let nextIndex;
        if (isShuffle) {
            nextIndex = getRandomIndex();
            setPreviousIndex(musicIndex);
        } else {
            nextIndex = (musicIndex + 1) % musicData.length;
        }
        updateCurrentMusicDetails(nextIndex);
        setIsDisabled(false);
    };

    // ⏮️ Previous Song
    const handlePrevSong = () => {
        let prevIndex;
        if (isShuffle && previousIndex != null) {
            prevIndex = previousIndex;
            setIsDisabled(true);
        } else {
            prevIndex =
                musicIndex === 0 ? musicData.length - 1 : musicIndex - 1;
        }
        updateCurrentMusicDetails(prevIndex);
    };

    // 🪄 Update state + URL
    const updateCurrentMusicDetails = (index) => {
        const song = musicData[index];
        setMusicIndex(index);
        setCurrentMusicDetails({
            title: song.title,
            artist: song.artist,
            src: song.src,
            cover: song.cover,
        });
        setIsPlaying(true);

        // Update the URL
        navigate(`/play/${index}`);
    };

    // 🔁 Auto-next or repeat
    const handleEnd = () => {
        const audio = currentAudio.current;
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            handleNextSong();
        }
    };

    // 💜 Favorites
    const toggleFavorite = () => {
        let updatedFavorites;
        if (isFavorite) {
            updatedFavorites = favorites.filter((f) => f !== musicIndex);
        } else {
            updatedFavorites = [...favorites, musicIndex];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className='w-full h-full flex justify-center items-center text-white bg-linear-to-b from-[#170935] via-[#13052b] to-[#1a0c38]'>
            <audio
                ref={currentAudio}
                preload='metadata'
                src={currentMusicDetails.src}
                onTimeUpdate={handleAudioUpdate}
                onEnded={handleEnd}
                crossOrigin='anonymous'
            />

            <div className='relative bg-zinc-600/5 backdrop-blur-lg w-80 rounded-3xl p-6 flex flex-col items-center shadow-[0_0_40px_8px_rgba(168,85,247,0.15)]'>
                {/* Cover */}
                <div className='relative h-44 w-full rounded-2xl overflow-hidden mb-6'>
                    <div
                        className='absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 cursor-pointer hover:scale-110 transition-transform'
                        onClick={toggleFavorite}
                    >
                        <Heart
                            size={22}
                            className={`transition-all ${
                                isFavorite
                                    ? 'text-pink-500 fill-pink-500'
                                    : 'text-gray-300'
                            }`}
                        />
                    </div>
                    <img
                        src={currentMusicDetails.cover}
                        alt={currentMusicDetails.title}
                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                    />
                </div>

                {/* Title + Artist */}
                <MarqueeTitle title={currentMusicDetails.title} />
                <p className='text-zinc-400 text-sm mb-5'>
                    {currentMusicDetails.artist}
                </p>

                {/* Shuffle + Repeat */}
                <div className='flex justify-between gap-3 mb-5 w-full'>
                    <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                            isShuffle
                                ? 'bg-zinc-900 text-purple-300 shadow-[0_0_12px_3px_rgba(168,85,247,0.6)]'
                                : 'text-zinc-400 hover:text-purple-300 hover:shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]'
                        }`}
                    >
                        <Shuffle size={20} />
                    </button>
                    <button
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                            isRepeat
                                ? 'bg-zinc-900 text-purple-300 shadow-[0_0_12px_3px_rgba(168,85,247,0.6)]'
                                : 'text-zinc-400 hover:text-purple-300 hover:shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]'
                        }`}
                    >
                        <Repeat size={20} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className='flex items-center justify-between text-xs w-full mb-2 text-zinc-400'>
                    <span>{musicCurrentTime}</span>
                    <span>{musicTotalLength}</span>
                </div>

                <input
                    type='range'
                    value={audioProgress}
                    onChange={handleMusicProgressBar}
                    className='w-full h-2 accent-purple-600 rounded-lg cursor-pointer'
                />

                {/* Controls */}
                <div className='flex justify-center items-center gap-6 mt-6'>
                    <button
                        onClick={handlePrevSong}
                        disabled={isDisabled}
                        className={`p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 hover:text-purple-400 transition-all ${
                            isDisabled ? 'opacity-50' : ''
                        }`}
                    >
                        <SkipBack size={22} />
                    </button>

                    <button
                        onClick={handleAudioPlay}
                        className='p-4 rounded-full bg-purple-500 hover:bg-purple-400 text-white shadow-lg hover:shadow-[0_0_20px_4px_rgba(168,85,247,0.6)] transition-all'
                    >
                        {isPlaying ? (
                            <Pause size={26} />
                        ) : (
                            <PlayIcon size={26} />
                        )}
                    </button>

                    <button
                        onClick={handleNextSong}
                        className='p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 hover:text-purple-400 transition-all'
                    >
                        <SkipForward size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Play;
