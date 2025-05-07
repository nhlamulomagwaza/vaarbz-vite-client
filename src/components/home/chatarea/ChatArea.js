'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import '../../../styles/components/chatarea.scss';
import ToUser from './Conversations/ToUser';
import TextArea from './Conversations/TextArea';
import Conversations from './Conversations/Conversations';
import WelcomeScreen from './WelcomeScreen';
import { VaarbzContext } from '../../store/VaarbzContext';
const ChatArea = () => {
    const { selectedUser, users } = useContext(VaarbzContext);
    return (_jsx(_Fragment, { children: _jsx("section", { className: "chat-area", children: selectedUser ? (_jsxs(_Fragment, { children: [_jsx(ToUser, {}), _jsx(Conversations, {}), _jsx(TextArea, {})] })) : _jsx(WelcomeScreen, {}) }) }));
};
export default ChatArea;
