
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  shouldShake?: boolean;
}

import '../../../../styles/components/chatarea.scss';
import { useContext } from 'react';
import { VaarbzContext } from '../../../../components/store/VaarbzContext';

import { MoonLoader } from 'react-spinners';
import useListenMessages from '../../../../hooks/useListenMessages.js';



const Conversations = () => {
  useListenMessages(); // Handles real-time updates
 
  const context = useContext(VaarbzContext);
  if (!context) {
    throw new Error('Conversations must be used within a VaarbzContextProvider');
  }
  const { authUserToken, selectedUser, authUser, messages, setMessages, typingUsers } = context;

  const [loadingMessages, setLoadingMessages] = useState(false);

  // Ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Fetch initial messages when selectedUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await fetch(
          `https://vaarbz.onrender.com/api/chats/getmessage/${selectedUser._id}`,
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authUserToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => {
            const existingIds = new Set(prevMessages.map((m) => m._id));
            const newMessages = data.filter((m) => !existingIds.has(m._id));
            return [...prevMessages, ...newMessages];
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (selectedUser?._id) {
      fetchMessages();
    }
  }, [selectedUser._id, authUserToken, setMessages]);

  // Clear messages when selectedUser changes
  useEffect(() => {
    setMessages([]);
  }, [selectedUser, setMessages]);

  return (
    <>
      <section className="conversations">
        {loadingMessages ? (
          <MoonLoader color="white" className="chats-loader" />
        ) : (
          <>
            {messages.length === 0 ? (
              <p
                style={{ color: 'white', margin: 'auto' }}
                className="no-messages"
              >
                No messages yet...
              </p>
            ) : (
              <>
                {messages
                  .filter(
                    (message: Message) =>
                      (message.senderId === selectedUser._id &&
                        message.receiverId === authUser.user._id) ||
                      (message.receiverId === selectedUser._id &&
                        message.senderId === authUser.user._id)
                  )
                  .map((message: Message) => (
                    <div
                      key={message._id}
                      className={`chat ${
                        selectedUser._id === message.receiverId
                          ? 'chat-end'
                          : 'chat-start'
                      }`}
                    >
                      <div
                        className="chat-bubble text-black"
                        style={{
                          backgroundColor:
                            selectedUser._id === message.receiverId
                              ? '#00B5FF'
                              : 'white',
                        }}
                        color="white"
                      >
                        {message.message}
                      </div>
                    </div>
                  ))}
           {typingUsers.has(selectedUser._id) && (
  <div className="chat chat-start">
  <div className="chat-bubble typing-indicator">
    <div className="typing-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  </div>
</div>
)}
                {/* Add a div to act as the scroll target */}
                <div ref={messagesEndRef} />
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Conversations;