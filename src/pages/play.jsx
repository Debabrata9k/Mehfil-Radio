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
    const currentAudio = useRef(null);

    const [currentMusicDetails, setCurrentMusicDetails] = useState({
        title: musicData[musicIndex].title,
        artist: musicData[musicIndex].artist,
        src: musicData[musicIndex].src,
        cover: musicData[musicIndex].cover,
    });

    useEffect(() => {
        const audio = currentAudio.current;
        if (!audio) return;
        audio.pause();
        audio.src = currentMusicDetails.src;
        audio.load();

        const onReady = () => {
            if (!isPlaying) {
                audio.play();
                setIsPlaying(true);
            }
        };
        audio.addEventListener('loadedmetadata', onReady);
        return () => audio.removeEventListener('loadedmetadata', onReady);
    }, [currentMusicDetails.src]);

    const handleAudioUpdate = () => {
        const audio = currentAudio.current;
        if (!audio || !audio.duration) return;
        const format = (n) => (n < 10 ? `0${n}` : n);
        const duration = audio.duration;
        const current = audio.currentTime;
        setMusicTotalLength(
            `${format(Math.floor(duration / 60))} : ${format(
                Math.floor(duration % 60)
            )}`
        );
        setMusicCurrentTime(
            `${format(Math.floor(current / 60))} : ${format(
                Math.floor(current % 60)
            )}`
        );
        const progress = (current / duration) * 100;
        setAudioProgress(isNaN(progress) ? 0 : progress);
    };

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

    const handleMusicProgressBar = (e) => {
        const value = Number(e.target.value);
        const audio = currentAudio.current;
        if (!audio) return;
        setAudioProgress(value);
        const seekTime = (value / 100) * audio.duration;
        const trySeek = () => {
            if (!isNaN(seekTime) && seekTime >= 0 && audio.duration > 0) {
                audio.currentTime = seekTime;
                if (isPlaying) audio.play();
            }
        };
        if (audio.readyState >= 2) trySeek();
        else audio.addEventListener('canplay', trySeek, { once: true });
    };

    const getRandomIndex = () => {
        let randomIndex = Math.floor(Math.random() * musicData.length);
        while (randomIndex === musicIndex && musicData.length > 1) {
            randomIndex = Math.floor(Math.random() * musicData.length);
        }
        return randomIndex;
    };

    const handleNextSong = () => {
        let nextIndex;
        if (isShuffle) {
            nextIndex = getRandomIndex();
        } else {
            nextIndex = musicIndex >= musicData.length - 1 ? 0 : musicIndex + 1;
        }
        updateCurrentMusicDetails(nextIndex);
    };

    const handlePrevSong = () => {
        let prevIndex;
        if (isShuffle) {
            prevIndex = getRandomIndex();
        } else {
            prevIndex =
                musicIndex === 0 ? musicData.length - 1 : musicIndex - 1;
        }
        updateCurrentMusicDetails(prevIndex);
    };

    const updateCurrentMusicDetails = (index) => {
        const song = musicData[index];
        setMusicIndex(index);
        navigate(`/play/${index}`);
        setCurrentMusicDetails({
            title: song.title,
            artist: song.artist,
            src: song.src,
            cover: song.cover,
        });
        setIsPlaying(true);
    };

    const handleEnd = () => {
        if (isRepeat) {
            const audio = currentAudio.current;
            audio.currentTime = 0;
            audio.play();
        } else {
            handleNextSong();
        }
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
                autoPlay
            ></audio>

            <div className='bg-zinc-300/5 backdrop-blur-lg w-80 rounded-3xl p-6  flex flex-col items-center'>
                <div className='h-44 w-full rounded-2xl overflow-hidden mb-6'>
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

                <div className='flex items-center justify-between text-xs w-full mb-2 text-zinc-400'>
                    <span>{musicCurrentTime}</span>
                    <span>{musicTotalLength}</span>
                </div>

                <input
                    type='range'
                    name='musicProgressBar'
                    value={audioProgress}
                    onChange={handleMusicProgressBar}
                    className='w-full h-2 accent-purple-600 rounded-lg appearance-auto cursor-pointer'
                />

                <div className='flex justify-center items-center gap-6 mt-6'>
                    <button
                        onClick={handlePrevSong}
                        className='p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 hover:text-purple-400 transition-all'
                    >
                        <SkipBack size={22} />
                    </button>

                    <button
                        onClick={handleAudioPlay}
                        className='p-4 rounded-full bg-purple-500 hover:bg-purple-400 text-white shadow-lg transition-all'
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

                <div className='flex justify-center gap-10 mt-6'>
                    <button
                        onClick={() => setIsShuffle(!isShuffle)}
                        className={`relative p-2 rounded-full transition-all duration-300 ${
                            isShuffle
                                ? 'bg-zinc-900 text-purple-300 shadow-[0_0_12px_3px_rgba(168,85,247,0.6)]'
                                : 'text-zinc-400 hover:text-purple-300 hover:shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]'
                        }`}
                    >
                        <span
                            className={`absolute inset-0 rounded-full blur-sm transition-opacity duration-500 ${
                                isShuffle
                                    ? 'bg-purple-500 opacity-40 animate-pulse'
                                    : 'opacity-0'
                            }`}
                        ></span>

                        <span className='relative z-10'>
                            <Shuffle
                                size={20}
                                className={`transition-all duration-300 ${
                                    isShuffle
                                        ? 'drop-shadow-[0_0_6px_rgba(168,85,247,0.9)] text-purple-300'
                                        : ''
                                }`}
                            />
                        </span>
                    </button>

                    <button
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`relative p-2 rounded-full transition-all duration-300 ${
                            isRepeat
                                ? 'bg-zinc-900 text-purple-300 shadow-[0_0_12px_3px_rgba(168,85,247,0.6)]'
                                : 'text-zinc-400 hover:text-purple-300 hover:shadow-[0_0_8px_2px_rgba(168,85,247,0.4)]'
                        }`}
                    >
                        <span
                            className={`absolute inset-0 rounded-full blur-sm transition-opacity duration-500 ${
                                isRepeat
                                    ? 'bg-purple-500 opacity-40 animate-pulse'
                                    : 'opacity-0'
                            }`}
                        ></span>

                        <span className='relative z-10'>
                            <Repeat
                                size={20}
                                className={`transition-all duration-300 ${
                                    isRepeat
                                        ? 'drop-shadow-[0_0_6px_rgba(168,85,247,0.9)] text-purple-300'
                                        : ''
                                }`}
                            />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Play;
