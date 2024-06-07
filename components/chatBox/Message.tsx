import React from 'react';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { text } from 'stream/consumers';

const Message = ({ text, sender, time }: { text: string; sender: string; time: string }) => {
  const isEmitter = sender === 'YO';

  return (
    <div className={`flex items-end gap-3 ${isEmitter ? 'justify-end' : ''}`}>
      <div className={`px-4 py-3 rounded-2xl max-w-[70%] ${isEmitter ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div className="text-sm">{text}</div>
        <div className={`text-xs mt-1 ${isEmitter ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{time}</div>
      </div>
    </div>
  );
};

export default Message;
