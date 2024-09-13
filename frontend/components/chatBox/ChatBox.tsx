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
    });
  }, []);

  return (
    <div className={cn("flex flex-col h-full w-full bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden", className)} {...restProps}>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
