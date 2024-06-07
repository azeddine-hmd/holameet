'use client';

import { useState } from 'react';
import MessageList from '@/components/chatBox/MessageList';
import MessageInput from '@/components/chatBox/MessageInput';
import { cn } from '@/lib/utils';

export type ChatBoxProps = React.ComponentProps<"div">;

function ChatBox({ className, ...restProps }: ChatBoxProps) {
  const [messages, setMessages] = useState([
    { text: "Hey there! How's it going?", sender: 'JD', time: '10:30 AM' },
    { text: "I'm doing great, thanks for asking!", sender: 'YO', time: '10:31 AM' },
    { text: "That's great to hear! I'm free this weekend, would you like to grab coffee?", sender: 'JD', time: '10:32 AM' },
    { text: "Sounds good, let's do it! Where should we meet?", sender: 'YO', time: '10:33 AM' },
  ]);

  const handleSend = (text: string) => {
    setMessages([...messages, { text, sender: 'YO', time: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className={cn("flex flex-col h-full w-full bg-white dark:bg-gray-950 rounded-2xl shadow-lg overflow-hidden", className)} {...restProps}>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatBox;
