"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebSocket } from '@/lib/hooks/web-socket/useWebSocket';
import React, { useEffect, useState } from 'react'

function page() {
    const socket = useWebSocket("ws://localhost:8000").socket;
    const [message, setMessage] = useState<string>("");
    const [input, setInput] = useState<string>("");
    useEffect(()=>{
        if (!socket) return;
        socket.onerror = (error) => {
            console.error("WebSocket error: ", error);
        }
        socket.onmessage = (event) => {
            console.log("Message from server: ", event.data);
            setMessage(event.data);
        }
    },[socket])

    const handleSendMessage = () =>{
        if (socket && input) {
            socket.send(input);
            setInput("");
        }
    }

    if(!socket){
        return <div>Connecting to socket....</div>
    }
  return (
    <div>
        <Input placeholder='enter message' onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        }}/>
        <Button onClick={handleSendMessage}>
            Send Message
        </Button>
      <div>
        {message && <p>Message from server: {message}</p>}
      </div>    
    </div>
  )
}

export default page
