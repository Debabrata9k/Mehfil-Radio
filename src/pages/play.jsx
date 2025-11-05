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
    Loader,
    Loader2,
} from 'lucide-react';

function Play() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentIndex = Number(id);

    const [musicIndex, setMusicIndex] = useState(currentIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [audioProgress, setAudioProgress] = useState(0);
    const [bufferProgress, setBufferProgress] = useState(0);
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

    // Sync when URL id changes
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
        setBufferProgress(0);
    }, [id]);

    // Load and autoplay
    useEffect(() => {
        const audio = currentAudio.current;
        if (!audio) return;

        setIsLoading(true);
        audio.pause();
        audio.src = currentMusicDetails.src;
        audio.load();

        const handleCanPlay = () => {
            setIsLoading(false);
            audio
                .play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        };

        const handleProgress = () => {
            if (audio.buffered.length > 0 && audio.duration > 0) {
                const end = audio.buffered.end(audio.buffered.length - 1);
                const percent = (end / audio.duration) * 100;
                setBufferProgress(percent);
            }
        };

        const handleTimeUpdate = () => {
            if (audio.duration > 0) {
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
                setAudioProgress((current / duration) * 100);
            }
        };

        const handleEnd = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                handleNextSong();
            }
        };

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('progress', handleProgress);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnd);

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('progress', handleProgress);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnd);
        };
    }, [currentMusicDetails.src]);

    const handleAudioPlay = () => {
        const audio = currentAudio.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            audio
                .play()
                .then(() => {
                    setIsLoading(false);
                    setIsPlaying(true);
                })
                .catch(() => setIsLoading(false));
        }
    };

    const handleMusicProgressBar = (e) => {
        const value = Number(e.target.value);
        const audio = currentAudio.current;
        if (!audio) return;
        const seek = (value / 100) * audio.duration;
        audio.currentTime = seek;
        setAudioProgress(value);
    };

    const getRandomIndex = () => {
        let randomIndex = Math.floor(Math.random() * musicData.length);
        while (randomIndex === musicIndex && musicData.length > 1) {
            randomIndex = Math.floor(Math.random() * musicData.length);
        }
        return randomIndex;
    };

    const handleNextSong = () => {
        let next;
        if (isShuffle) {
            next = getRandomIndex();
            setPreviousIndex(musicIndex);
        } else {
            next = (musicIndex + 1) % musicData.length;
        }
        updateCurrentMusicDetails(next);
        setIsDisabled(false);
    };

    const handlePrevSong = () => {
        let prev;
        if (isShuffle && previousIndex != null) {
            prev = previousIndex;
            setIsDisabled(true);
        } else {
            prev = musicIndex === 0 ? musicData.length - 1 : musicIndex - 1;
        }
        updateCurrentMusicDetails(prev);
    };

    const updateCurrentMusicDetails = (index) => {
        const song = musicData[index];
        setMusicIndex(index);
        setCurrentMusicDetails({
            title: song.title,
            artist: song.artist,
            src: song.src,
            cover: song.cover,
        });
        navigate(`/play/${index}`);
        setIsPlaying(true);
        setIsLoading(true);
    };

    const toggleFavorite = () => {
        let updated;
        if (isFavorite) {
            updated = favorites.filter((f) => f !== musicIndex);
        } else {
            updated = [...favorites, musicIndex];
        }
        setFavorites(updated);
        localStorage.setItem('favorites', JSON.stringify(updated));
    };

    return (
        <div className='w-full h-full flex justify-center items-center text-white bg-linear-to-b from-[#170935] via-[#13052b] to-[#1a0c38]'>
            <audio
                ref={currentAudio}
                preload='metadata'
                // crossOrigin='anonymous'
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

                {/* Time + Buffered Bar */}
                <div className='flex items-center justify-between text-xs w-full mb-2 text-zinc-400'>
                    <span>{musicCurrentTime}</span>
                    <span>{musicTotalLength}</span>
                </div>

                {/* PG Bar */}
                <div className='relative w-full h-2 mb-3'>
                    <div
                        className='absolute z-10 pointer-events-none top-0 left-0 h-2 opacity-50 bg-purple-500 rounded-lg transition-all duration-300'
                        style={{ width: `${bufferProgress}%` }}
                    ></div>
                    <input
                        type='range'
                        value={audioProgress}
                        onChange={handleMusicProgressBar}
                        className='absolute w-full h-2 accent-purple-600 rounded-lg cursor-pointer'
                    />
                </div>

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
                        className='p-4 rounded-full bg-purple-500 hover:bg-purple-400 text-white shadow-lg hover:shadow-[0_0_20px_4px_rgba(168,85,247,0.6)] transition-all '
                    >
                        {isLoading ? (
                            <Loader2 className='animate-spin' />
                        ) : isPlaying ? (
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
