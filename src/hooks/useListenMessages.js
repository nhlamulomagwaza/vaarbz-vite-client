import { useContext, useEffect, useState } from "react";
import { VaarbzContext } from "../components/store/VaarbzContext";
import { useSocketContext } from "../components/store/SocketContext";
import toast from "react-hot-toast";

const useListenMessages = () => {
  console.log("useListenMessages is being executed");

  const { socket } = useSocketContext();
  const { setMessages, messages , users, typingUsers, setTypingUsers} = useContext(VaarbzContext);
  console.log("Socket value in useListenMessages:", socket);
  console.log("setMessages value in useListenMessages:", setMessages);
 
  const authUser = JSON.parse(localStorage.getItem("vaarbz-user"));
// State to track multiple typing users

useEffect(() => {
  if (!socket) {
    console.log("Socket is not initialized.");
    return;
  }

  const typingHandler = ({ senderId }) => {
    console.log(`Typing event received. Sender ID: ${senderId}`);
    setTypingUsers((prev) => {
      const updated = new Set(prev);
      updated.add(senderId);
      return updated;
    });
  };

  const stopTypingHandler = ({ senderId }) => {
    console.log(`User with ID ${senderId} stopped typing.`);
    setTypingUsers((prev) => {
      const updated = new Set(prev);
      updated.delete(senderId);
      return updated;
    });
  };

  const messageHandler = (newMessage) => {
    console.log("New message received:", newMessage);
   // setMessages((prev) => [...prev, newMessage]);
  
   // Display a toast notification for the new message with a 6-second duration
   if (newMessage.senderId !== authUser.user._id) {
    toast.success(`New message from ${newMessage.senderName || "a user"}: ${newMessage.message}`, {
      duration: 6000, // Toast will last for 6 seconds
    });
  }
  };
 // Display a toast notification for the new message

  // Attach event listeners
  socket.on("typing", typingHandler);
  socket.on("stop_typing", stopTypingHandler);
  socket.on("receive_message", messageHandler);

  // Log the number of listeners for debugging
  console.log("Listeners for receive_message:", socket.listeners("receive_message").length);

  // Cleanup event listeners on unmount
  return () => {
    socket.off("typing", typingHandler);
    socket.off("stop_typing", stopTypingHandler);
    socket.off("receive_message", messageHandler);
  };
}, [socket, messages, setMessages, typingUsers]);
  return { typingUsers };
};

export default useListenMessages;