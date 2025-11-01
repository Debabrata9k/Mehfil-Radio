import React from 'react';
import { Link } from 'react-router';
import LOGO from '/main.png';
function nav() {
    return (
        <nav className='bg-linear-65 from-purple-500 to-purple-900 text-white p-4 flex justify-between items-center'>
            <h1 className='font-bold text-lg'>
                <img src={LOGO} className='h-12 rounded-full' />
            </h1>
            <div className='flex gap-4'>
                <Link to='/' className='hover:text-gray-300'>
                    Home
                </Link>
                <Link to='/explore' className='hover:text-gray-300'>
                    Exdplore
                </Link>
            </div>
        </nav>
    );
}

export default nav;
