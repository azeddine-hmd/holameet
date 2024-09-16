'use client';

import { useEffect, useState } from 'react';
import MessageList from '@/components/chatBox/MessageList';
import MessageInput from '@/components/chatBox/MessageInput';
import { cn } from '@/lib/utils';
import { useEvent } from '@/hooks/use-event';
import { format } from 'date-fns';

export type ChatBoxProps = React.ComponentProps<"div">;

export type ChatContent = {
  text: string;
  sender: string;
  time: string;
};

function ChatBox({ className, ...restProps }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatContent[]>([]);
  const [onSession, setOnSession] = useState(false);

  const handleSend = (text: string) => {
    console.log("sending new message:", text);
    window.socket.emit("sendMessage", text);
  };

  useEvent("receiveMessage", (newMsg: ChatContent) => {
      console.log("receive a new message: ", newMsg);
      newMsg.time = format(newMsg.time, "h:mm a");
      setMessages((prevMessages) => [...prevMessages, newMsg]);
  });

  useEffect(() => {
    document.addEventListener("session stopped", () => {
      setMessages([]);
      setOnSession(false);
    });
    document.addEventListener("session started", () => {
      setOnSession(true);
    });
  }, []);

  return (
    <div className={cn("flex flex-col h-full w-full bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden", className)} {...restProps}>
      {!onSession &&
        <div className="rounded-none mx-auto mt-4 text-center text-black/60">
          looking for someone to chat...
        </div>
      }
      <MessageList messages={messages} />
      <MessageInput disabled={!onSession} onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
