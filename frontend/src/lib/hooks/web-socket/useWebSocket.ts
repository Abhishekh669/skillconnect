'use client'

import { useEffect, useState } from "react";


export const useWebSocket = (url : string) =>{
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket is connected");
            setSocket(ws);
        };

       
        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        ws.onclose = () => {
            console.log("WebSocket is closed");
        };

        return () => {
            ws.close();
        };
    }, [url]);

   

    return { socket, };         
}