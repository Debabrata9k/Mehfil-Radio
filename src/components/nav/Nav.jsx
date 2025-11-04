import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, Home, Music, Code, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import LOGO from '/main.png';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const shineRef = useRef(null);

    // GSAP animation for mobile menu
    useEffect(() => {
        if (isOpen) {
            gsap.fromTo(
                menuRef.current,
                { y: -50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
            );
        } else {
            gsap.to(menuRef.current, {
                y: -50,
                opacity: 0,
                duration: 0.3,
                ease: 'power3.in',
            });
        }
    }, [isOpen]);

    // 🟣 Shine animation: left → right infinite, 2s delay between loops
    useEffect(() => {
        const shine = gsap.fromTo(
            shineRef.current,
            { x: '-150%' },
            {
                x: '400%',
                duration: 2,
                ease: 'power1.inOut',
                repeat: -1,
                repeatDelay: 3, // 2s delay between each glow sweep
            }
        );
        return () => shine.kill();
    }, []);

    return (
        <nav className='top-0 left-0 w-full z-50 bg-linear-to-r from-purple-700 via-purple-800 to-purple-900 backdrop-blur-lg border-b border-white/10 shadow-lg text-white '>
            <div className='max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center'>
                {/* Logo */}
                <div className='flex items-center gap-3'>
                    <img
                        src={LOGO}
                        alt='Logo'
                        className='h-10 w-10 rounded-full border border-purple-400/30 shadow-md hover:scale-105 transition-transform'
                    />
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:flex items-center gap-8 text-sm font-medium'>
                    <Link
                        to='/'
                        className='flex items-center gap-1 hover:text-purple-300 transition-all'
                    >
                        <Home size={16} /> Home
                    </Link>
                    <Link
                        to='/explore'
                        className='flex items-center gap-1 hover:text-purple-300 transition-all'
                    >
                        <Music size={16} /> Explore
                    </Link>
                    <Link
                        to='/favorite'
                        className='flex items-center gap-2 hover:text-purple-300 transition-all'
                    >
                        <Heart size={16} /> Favorite
                    </Link>

                    {/* Glass View Code Button with Infinite Glow */}
                    <a
                        href='https://github.com/Asif-4520/Mehfil-Radio'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='relative flex items-center gap-1 px-4 py-1.5 rounded-full overflow-hidden border border-purple-400/30 bg-white/10 hover:bg-white/15 backdrop-blur-md text-purple-200 transition-all'
                    >
                        <Code size={16} />
                        View Code
                        {/* Moving Shine Effect */}
                        <span
                            ref={shineRef}
                            className='absolute top-0 left-[-30%] w-1/3 h-full bg-linear-to-r from-transparent via-white/70 to-transparent opacity-60 skew-x-20 pointer-events-none'
                        ></span>
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className='md:hidden p-2 hover:bg-purple-700/40 rounded-lg transition-all'
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                ref={menuRef}
                className={`${
                    isOpen ? 'block' : 'hidden'
                } md:hidden absolute w-full left-0 bg-linear-to-b from-purple-900/80 to-purple-950/70 `}
            >
                <div className='flex flex-col items-center py-4 gap-4 text-sm'>
                    <Link
                        to='/'
                        className='flex items-center gap-2 hover:text-purple-300 transition-all'
                        onClick={() => setIsOpen(false)}
                    >
                        <Home size={16} /> Home
                    </Link>
                    <Link
                        to='/explore'
                        className='flex items-center gap-2 hover:text-purple-300 transition-all'
                        onClick={() => setIsOpen(false)}
                    >
                        <Music size={16} /> Explore
                    </Link>
                    <Link
                        to='/favorite'
                        className='flex items-center gap-2 hover:text-purple-300 transition-all'
                    >
                        <Heart size={16} /> Favorite
                    </Link>

                    {/* Glass View Code (Mobile) */}
                    <a
                        href='https://github.com/Asif-4520/Mehfil-Radio'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 bg-white/10 hover:bg-white/15 px-4 py-1.5 rounded-full border border-purple-400/30 backdrop-blur-md transition-all text-purple-200'
                    >
                        <Code size={16} /> View Code
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
