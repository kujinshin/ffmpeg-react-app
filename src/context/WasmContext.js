import React, { useEffect, useState } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

const WasmContext = React.createContext({});

function WasmProvider({children}) {
    const [wasmState, setWasmState] = useState({});

    useEffect(() => {
        loadFfmpeg().then((ffmpeg) => {
            setWasmState({
                ffmpeg,
                isLoaded: ffmpeg.isLoaded()
            })
        })

    }, [])

    return (
        <WasmContext.Provider value={wasmState}>
            {children}
        </WasmContext.Provider>
      );
    
}

async function loadFfmpeg() {
    const ffmpeg = createFFmpeg({
        log: true,
    });
    
    await ffmpeg.load();
    console.log('ffmpeg loaded')
    
    return ffmpeg;
}

export { WasmProvider, WasmContext };