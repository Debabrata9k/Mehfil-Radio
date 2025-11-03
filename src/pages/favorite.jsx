import { useEffect, useState } from 'react';
import MusicData from '../musicData';
import MusicCard from '../components/Music-Card';
import { Link } from 'react-router';
import {Plus} from 'lucide-react';


function favorite() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const favoriteSongs = MusicData.filter((song) => favorites.includes(song.id));

  const topSongs = favoriteSongs;

  return (
    <div className='w-full h-screen text-white overflow-y-scroll bg-linear-to-b from-[#0a0515] via-[#13052b] to-[#0a0515]'>
      {/* Scrollable Container */}
      <div className='relative w-full h-full px-4 sm:px-6 md:px-10 py-10'>
        <h1 className='text-xl sm:text-3xl md:text-4xl font-bold mb-8 text-center text-purple-400 tracking-wide'>
          ❤️ Fav Songs ❤️
        </h1>

        <div className='w-full flex justify-between'>
          <h2 className='text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-pink-400 text-left'>
            Favorite Songs {favoriteSongs.length > 0 ? 'You Love' : ' '}
          </h2>
          <Link
            to='/Explore'
            className='hover:text-purple-300 transition-all'
          >
            <Plus />
          </Link>
        </div>

        {/* Grid of Top Music Cards */}
        <div className='pb-20 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
          {topSongs.map((item, index) => (
            <MusicCard
              id={item.id}
              item={item}
              key={index}
              isfavorites={favoriteSongs.length >= 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default favorite;
