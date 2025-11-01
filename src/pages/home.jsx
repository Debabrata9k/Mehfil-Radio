import React from 'react';
import Profile from '../../public/main.png';
function Home() {
    return (
        <div className='w-full h-full flex justify-center items-center flex-col'>
            <div className='w-full h-full bg-zinc-800 flex justify-center items-center flex-col mb-5 rounded-b-3xl shadow-2xl shadow-black'>
                <h2 className='text-white font-mono font-bold italic text-[100px] text-center pt-5 transition-transform duration-500 ease-out hover:translate-x-4'>
                    MEHFIL-RADIO
                </h2>
                <p className='text-white'>Music Player</p>
            </div>
            <div className='shadow-lg rounded-2xl bg-zinc-800 w-55 h-70 flex justify-center items-center flex-col gap-5 overflow-hidden cursor-pointer relative'>
                {/* Image container (make this the hover group) */}
                <div className='relative h-40 w-50 bg-zinc-800 rounded-2xl p-5 overflow-hidden group'>
                    <img
                        src='https://picsum.photos/id/237/200/300'
                        className='h-full w-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105'
                        alt='Picture'
                    />
                    {/* Play Button */}
                    <div
                        className='absolute bottom-3 right-3 opacity-0 translate-y-3 
                 group-hover:opacity-100 group-hover:translate-y-0 
                 transition-all duration-300 ease-in-out'
                    >
                        <button className='bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg'>
                            ▶
                        </button>
                    </div>
                </div>
                {/* Title */}
                <h2 className='text-center text-white'>Title</h2>
            </div>
        </div>
    );
}

export default Home;
