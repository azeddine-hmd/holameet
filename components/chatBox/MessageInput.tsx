import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SendIcon from '@/components/icons/SendIcon';
const MessageInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState('');

  const handleSendClick = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
      <Textarea
        placeholder="Type your message..."
        value={text}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
        className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white h-10"
      />
      <Button onClick={handleSendClick} className="bg-orange-500 hover:bg-orange-600 text-white h-10">
        <SendIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
