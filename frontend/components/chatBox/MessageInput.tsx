import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SendIcon from '@/components/icons/SendIcon';

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (text.trim()) {
      console.log("text.trim():", text.trim());
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
      <Textarea
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (!e.shiftKey && e.key === "Enter" && text.trim() !== "") {
            e.preventDefault();
            sendMessage();
          } else if (e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            setText(text + "\n");
          } 
        }}
        className="flex-1 rounded-2xl border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white h-10 resize-none"
      />
      <Button onClick={sendMessage} className="bg-orange-500 hover:bg-orange-600 text-white h-10">
        <SendIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
