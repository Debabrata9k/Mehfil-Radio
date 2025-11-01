import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import Explore from './pages/Explore';
import Home from './pages/Home';
import Play from './pages/play';
import Nav from './components/nav/Nav';
export default function App() {
    return (
      <Router>
            <div className='bg-black h-screen w-screen grid grid-rows-[70px_1fr] overflow-hidden'>
                <Nav />
                <div className=' w-full h-full'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/explore' element={<Explore />} />
                        <Route path='/play/:id' element={<Play />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}
