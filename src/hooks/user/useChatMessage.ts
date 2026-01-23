import { useState, useEffect } from 'react';
import { ChatMessage } from '@/types';

export const useChatMessage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const updateChatMessage = (
    content: string,
    sender: 'user' | 'support' = 'user',
    type: 'text' | 'image' | 'video' = 'text'
  ) => {
    const date = new Date();
    const newMessage: ChatMessage = {
      id: date.getTime(),
      type: type,
      content: content.trim(),
      sender: sender,
      timestamp: date,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages(prev => [
        ...prev,
        {
          id: new Date().getTime(),
          type: 'text',
          content: '您好！👋 有什么可以帮您的吗？欢迎反馈您遇到的问题。',
          sender: 'support',
          timestamp: new Date(),
        },
      ]);
    }
  }, [chatMessages]);
  return { chatMessages, updateChatMessage };
};
