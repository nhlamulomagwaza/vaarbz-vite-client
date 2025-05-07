import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
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
    const messagesEndRef = useRef(null);
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
                const response = await fetch(`https://vaarbz.onrender.com/api/chats/getmessage/${selectedUser._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authUserToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages((prevMessages) => {
                        const existingIds = new Set(prevMessages.map((m) => m._id));
                        const newMessages = data.filter((m) => !existingIds.has(m._id));
                        return [...prevMessages, ...newMessages];
                    });
                }
            }
            catch (e) {
                console.log(e);
            }
            finally {
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
    return (_jsx(_Fragment, { children: _jsx("section", { className: "conversations", children: loadingMessages ? (_jsx(MoonLoader, { color: "white", className: "chats-loader" })) : (_jsx(_Fragment, { children: messages.length === 0 ? (_jsx("p", { style: { color: 'white', margin: 'auto' }, className: "no-messages", children: "No messages yet..." })) : (_jsxs(_Fragment, { children: [messages
                            .filter((message) => (message.senderId === selectedUser._id &&
                            message.receiverId === authUser.user._id) ||
                            (message.receiverId === selectedUser._id &&
                                message.senderId === authUser.user._id))
                            .map((message) => (_jsx("div", { className: `chat ${selectedUser._id === message.receiverId
                                ? 'chat-end'
                                : 'chat-start'}`, children: _jsx("div", { className: "chat-bubble text-black", style: {
                                    backgroundColor: selectedUser._id === message.receiverId
                                        ? '#00B5FF'
                                        : 'white',
                                }, color: "white", children: message.message }) }, message._id))), typingUsers.has(selectedUser._id) && (_jsx("div", { className: "chat chat-start", children: _jsx("div", { className: "chat-bubble typing-indicator", children: _jsxs("div", { className: "typing-dots", children: [_jsx("span", { className: "dot" }), _jsx("span", { className: "dot" }), _jsx("span", { className: "dot" })] }) }) })), _jsx("div", { ref: messagesEndRef })] })) })) }) }));
};
export default Conversations;
