import React, { useRef, useEffect } from 'react';

export default function MainMenu(){
    const audioRef = useRef<undefined | any>(undefined);

    useEffect(() => {
        
    })

    return (
        <div style={{display: "inline-flex", justifyContent: "center", width: "100%",  height: "98vh", marginTop: "1vh"}} onClick={() => {audioRef.current?.play();}}>
            <img src="/assets/misc/menuScreen.gif" alt="this slowpoke moves"  height="100%"/>
            <audio ref={audioRef}>
                <source src={'/assets/music/quasarTheme.mp3'} type="audio/mp3" />
            </audio>
        </div>
    )
}