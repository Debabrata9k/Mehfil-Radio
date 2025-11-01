import { useEffect, useRef, useState } from 'react';

function MarqueeTitle({ title }) {
    const titleRef = useRef();
    const containerRef = useRef();
    const [duration, setDuration] = useState(10);

    useEffect(() => {
        const titleEl = titleRef.current;
        const containerEl = containerRef.current;

        if (titleEl && containerEl) {
            const titleWidth = titleEl.scrollWidth;
            const containerWidth = containerEl.offsetWidth;

            if (titleWidth > containerWidth) {
                const speed = 50;
                const calcDuration = titleWidth / speed;
                setDuration(calcDuration);
            } else {
                setDuration(0);
            }
        }
    }, [title]);

    return (
        <div
            ref={containerRef}
            className='w-full overflow-hidden whitespace-nowrap mb-1 text-center'
        >
            <div
                ref={titleRef}
                className={`text-white font-semibold text-xl inline-block ${
                    duration > 0 ? 'animate-marquee' : ''
                }`}
                style={{
                    animationDuration: `${duration}s`,
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                }}
            >
                {title}
            </div>
        </div>
    );
}

export default MarqueeTitle;
