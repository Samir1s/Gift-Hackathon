import React, { useEffect, useState } from 'react';

const Separator = ({ strings = ['Learn', 'Practice', 'Earn', 'Master'] }) => {
    const [binaries, setBinaries] = useState([]);

    useEffect(() => {
        const bin = strings.map((string) => {
            return string
                .split('')
                .map((char) => char.charCodeAt(0).toString(2))
                .join(' ');
        });
        setBinaries(bin);
    }, [strings]);

    return (
        <div className="flex flex-row items-center justify-between relative px-4 w-full h-9 border-t border-b border-white bg-background font-mono text-[8px] leading-[16px] overflow-hidden select-none">
            {/* Left Triangle */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-0 h-0 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent border-l-[4px] border-l-white"></div>

            {/* Middle Binaries */}
            <div className="flex flex-row items-center justify-between px-3 w-full max-w-full overflow-hidden">
                {binaries.map((binary, index) => (
                    <React.Fragment key={index}>
                        <span className="flex flex-row items-start shrink-0 text-white/50">
                            {binary}
                        </span>
                        {index !== binaries.length - 1 && (
                            <span className="mx-2 h-2 overflow-hidden text-white/30 text-shadow-sm leading-[8px] tracking-[2px] shrink line-clamp-1 whitespace-nowrap hidden sm:block">
                                ////////////////////////////////////////////////////////////////////////////////////////////////
                            </span>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Right Triangle */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 w-0 h-0 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent border-r-[4px] border-r-white"></div>
        </div>
    );
};

export default Separator;
