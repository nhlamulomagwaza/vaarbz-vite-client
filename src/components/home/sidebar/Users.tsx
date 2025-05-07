import React, { useEffect, useState } from 'react';
import '../../../styles/components/sidebar.scss';
import { FaHeart, FaSmile, FaThumbsUp, FaStar, FaGrin, FaLaugh, FaSadCry, FaAngry, FaSurprise, FaMeh, FaFrown, FaKissWinkHeart, FaCoffee, FaAppleAlt, FaBook } from 'react-icons/fa'; // Import additional icons
import  { VaarbzContext } from '../../store/VaarbzContext';
import { MoonLoader } from 'react-spinners';
import { useSocketContext } from '../../store/SocketContext';
import toast from 'react-hot-toast';
interface User {
  id: number;
  username: string;
  lastSeen: string;
  profilePicture: string; // Ensure this property exists
  status: string; // Ensure this property exists
}

interface VaarbzContextType {
  users: User[];
  authUser: any; // Add the correct type for authUsers
  loadingUsers: boolean; // Add the correct type for loadingUsers
}

const Users = () => {
  const { users, authUser, loadingUsers, setSelectedUser, selectedUser, filteredUsersArray, searchUser, messages} = React.useContext(VaarbzContext);
  const { socket } = useSocketContext();

 
  // Handle typing events
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set()); // Track multiple typing users
  const { onlineUsers } = useSocketContext();
	const isOnline = (userId: string) => onlineUsers.some((user: any) => user.userId === userId); 
// Helper function to get the latest message for a user
const getLatestMessage = (userId: string) => {
  const userMessages = messages.filter(
    (message) =>
      (message.senderId === userId && message.receiverId === authUser.user._id) ||
      (message.receiverId === userId && message.senderId === authUser.user._id)
  );
  if (userMessages.length === 0) return null; // No messages for this user
  return userMessages.reduce((latest, current) =>
    new Date(latest.createdAt).getTime() > new Date(current.createdAt).getTime() ? latest : current
  );
};

  // Handle typing events
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }: { senderId: string }) => {
      console.log(`User with ID ${senderId} is typing...`);
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.add(senderId); // Add the senderId to the set
        return updated;
      });
    };

    const handleStopTyping = ({ senderId }: { senderId: string }) => {
      console.log(`User with ID ${senderId} stopped typing.`);
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(senderId); // Remove the senderId from the set
        return updated;
      });
    };

    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [socket]);
  // Array of emoji components
  const emojis = [
    <FaHeart color='red' size={25} />,
    <FaSmile color='yellow' size={25} />,
    <FaThumbsUp color='blue' size={25} />,
    <FaStar color='gold' size={25} />,
    <FaGrin color='green' size={25} />,
    <FaLaugh color='orange' size={25} />,
    <FaSadCry color='pink' size={25} />,
    <FaAngry color='red' size={25} />,
    <FaSurprise color='pink' size={25} />,
    <FaMeh color='grey' size={25} />,
    <FaFrown color='darkgrey' size={25} />,
    <FaKissWinkHeart color='lightpink' size={25} />,
    <FaCoffee color='brown' size={25} />,
    <FaAppleAlt color='red' size={25} />,
    <FaBook color='blue' size={25} />,
  ];
console.log(selectedUser)
  // Function to get a random emoji
  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  };
  const handleUserSelect = (user: User) => {
    setSelectedUser(user); // Set the selected user when a user is clicked
  };
  
  // Restore selected user from localStorage
  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('selectedUser'));
    if (storedUser) {
    
     setSelectedUser(storedUser);
    }
  }, []);

  // Update selected user in localStorage
  React.useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('selectedUser');
    }
  }, [selectedUser]);

  

  
 console.log("online users:");
  console.log(onlineUsers);

// Helper function to get username by user ID
const getUsernameById = (userId: string) => {
  // First check in the onlineUsers array
  const onlineUser = onlineUsers.find(u => u.userId === userId);
  if (onlineUser?.username) return onlineUser.username;
  
  // Fallback to checking in the users array
  const user = users?.find(u => u._id === userId);
  return user?.username || userId; // Final fallback to ID
};

const notifiedUsers = React.useRef(new Set());

useEffect(() => {
  if (!onlineUsers || !authUser?.user?._id) return;

  onlineUsers.forEach((onlineUser) => {
    if (onlineUser.userId !== authUser.user._id && !notifiedUsers.current.has(onlineUser.userId)) {
      const username = getUsernameById(onlineUser.userId);
      toast(`${username} is online`, {
        icon: '🟢',
        style: { background: '#f0fff0' },
        duration: 3000,
      });
      notifiedUsers.current.add(onlineUser.userId); // Mark this user as notified
    }
  });
}, [users]);
// Sort users so that online users appear first
const getLatestMessageTimestamp = (userId: string) => {
  const userMessages = messages.filter(
    (message) => message.senderId === userId || message.receiverId === userId
  );
  if (userMessages.length === 0) return 0; // No messages for this user
  return Math.max(...userMessages.map((message) => new Date(message.createdAt).getTime()));
};

 // Sort users by online status
 const sortedUsers = filteredUsersArray?.slice().sort((a, b) => {
  const aIsOnline = isOnline(a._id);
  const bIsOnline = isOnline(b._id);

  // Online users come first
  return bIsOnline - aIsOnline;
});

  return (
    <>
    <section className="users">
    {loadingUsers ? (
      <MoonLoader color="#b0b0b0" className="users-loader" />
    ) : (
      sortedUsers
        ?.filter((user) => user._id !== authUser.user._id)
        .map((user) => {
          const latestMessage = getLatestMessage(user._id);
          const isTyping = typingUsers.has(user._id);

          return (
            <div
              key={user._id}
              className={`user ${selectedUser?._id === user._id ? 'selected-user' : 'user'}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className="user-meta">
                <img
                  src={user.profilePicture}
                  className="profile-picture"
                  alt={`${user.username}'s profile`}
                />
                <div className={isOnline(user._id) ? 'online-status' : null}></div>
                <div className="username">
                  {user.username}{' '}
                  <span>
                    {isTyping ? (
                      <p style={{ color: 'lime' }}>typing...</p>
                    ) : latestMessage ? (
                      <p
                        style={{
                          color:
                            latestMessage.senderId === authUser.user._id
                              ? 'white'
                              : 'lime',
                        }}
                      >
                        {latestMessage.message}
                      </p>
                    ) : (
                      `Joined: ${new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}`
                    )}
                  </span>
                </div>
              </div>
              <div className="random-emoji">
                {getRandomEmoji()} {/* Call the function to get a random emoji */}
              </div>
            </div>
          );
        })
    )}
    {searchUser.length > 0 && filteredUsersArray.length === 0 && !loadingUsers ? (
      <p className="no-match">No user(s) found with the username(s) "{searchUser}"</p>
    ) : null}
  </section>
  
  </>
  );
};

export default Users;