import React from 'react';
import Message from './Message';

const MessageList = ({ messages }: any) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg: any, index: number) => (
        <Message key={index} text={msg.text} sender={msg.sender} time={msg.time} />
      ))}
    </div>
  );
};

export default MessageList;
