import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { IoIosSend } from "react-icons/io";
import '../../../../styles/components/chatarea.scss';
import { useState } from 'react';
import { VaarbzContext } from '../../../store/VaarbzContext';
import toast from 'react-hot-toast';
import { useSocketContext } from '../../../store/SocketContext';
const TextArea = () => {
    const { selectedUser, authUserToken, message, setMessage, messages, authUser, setMessages } = React.useContext(VaarbzContext);
    const { socket } = useSocketContext();
    const [isTyping, setIsTyping] = useState(false);
    let typingTimeout;
    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { senderId: authUser.user._id, receiverId: selectedUser._id });
        }
        // Clear any existing timeout
        if (typingTimeout)
            clearTimeout(typingTimeout);
        // Stop typing after 2 seconds of inactivity
        typingTimeout = setTimeout(() => {
            setIsTyping(false);
            socket.emit('stop_typing', { senderId: authUser.user._id, receiverId: selectedUser._id });
        }, 2000);
    };
const sendMessage = async (e) => {
    e.preventDefault();

    if (message.length === 0) {
        return toast.error('Cannot send a blank text');
    }

    // Create a temporary message object
    /* const tempMessage = {
        _id: `temp-${Date.now()}`, // Temporary unique ID
        senderId: authUser.user._id,
        receiverId: selectedUser._id,
        message: message,
        createdAt: new Date().toISOString(), // Add a timestamp
        isTemporary: true, // Mark as a temporary message
    };

    // Optimistically update the messages state
    setMessages((prevMessages) => [...prevMessages, tempMessage]); */
  

    try {
        const token = authUserToken || localStorage.getItem('vaarbz-user-token'); // Fallback to localStorage
        if (!token) {
            return toast.error('Invalid token. Please log in again.');
        }

        const response = await fetch(`https://vaarbz.onrender.com/api/chats/sendmessage/${selectedUser._id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ message }),
        });

        if (response.ok) {
            const responseData = await response.json();
  setMessage(''); // Clear the input field
            // Replace the temporary message using senderId and receiverId
           /*  setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.isTemporary &&
                    msg.senderId === authUser.user._id &&
                    msg.receiverId === selectedUser._id
                        ? responseData
                        : msg
                )
            ); */

            console.log('Message sent successfully');
        } else {
            // Remove the temporary message if the API request fails
            setMessages((prevMessages) =>
                prevMessages.filter(
                    (msg) =>
                        !(msg.isTemporary &&
                          msg.senderId === authUser.user._id &&
                          msg.receiverId === selectedUser._id)
                )
            );
            toast.error('Failed to send message');
        }
    } catch (error) {
        // Remove the temporary message if an error occurs
        setMessages((prevMessages) =>
            prevMessages.filter(
                (msg) =>
                    !(msg.isTemporary &&
                      msg.senderId === authUser.user._id &&
                      msg.receiverId === selectedUser._id)
            )
        );
        toast.error(error.message || String(error));
    }
};
    useEffect(() => {
        console.log('these are the messages:');
        console.log(messages);
    }, [messages]);
    return (_jsxs("section", { className: "text-area", children: [_jsx("input", { type: "text", placeholder: "send a message", className: "text-input", value: message, onChange: (e) => {
                    setMessage(e.target.value);
                    handleTyping();
                }, onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                        sendMessage(e);
                    }
                } }), _jsx(IoIosSend, { className: "send-text-icon", size: 20, onClick: sendMessage })] }));
};
export default TextArea;
