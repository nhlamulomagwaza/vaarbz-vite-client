import React from 'react';
import { FaHeart, FaSmile, FaThumbsUp, FaStar, FaGrin, FaLaugh, FaSadCry, FaAngry, FaSurprise, FaMeh, FaFrown, FaKissWinkHeart, FaCoffee, FaAppleAlt, FaBook } from 'react-icons/fa';
import { VaarbzContext } from '../../store/AppContext';
import { MoonLoader } from 'react-spinners';
import { useSocketContext } from '../../store/SocketContext';

interface User {
  _id: string;
  id: number;
  username: string;
  profilePicture: string;
  createdAt: string;
}

const UsersFixed = () => {
  const context = React.useContext(VaarbzContext);
  const socketContext = useSocketContext();
  
  if (!context || !socketContext) return null;

  const { 
    authUser, 
    loadingUsers, 
    setSelectedUser, 
    selectedUser, 
    users, 
    searchUser 
  } = context;

  const { onlineUsers } = socketContext;

  const emojis = [
    { icon: <FaHeart color='red' size={25} key="heart" />, id: 1 },
    { icon: <FaSmile color='yellow' size={25} key="smile" />, id: 2 },
    { icon: <FaThumbsUp color='blue' size={25} key="thumbsup" />, id: 3 },
    { icon: <FaStar color='gold' size={25} key="star" />, id: 4 },
    { icon: <FaGrin color='green' size={25} key="grin" />, id: 5 },
    { icon: <FaLaugh color='orange' size={25} key="laugh" />, id: 6 },
    { icon: <FaSadCry color='pink' size={25} key="sadcry" />, id: 7 },
    { icon: <FaAngry color='red' size={25} key="angry" />, id: 8 },
    { icon: <FaSurprise color='pink' size={25} key="surprise" />, id: 9 },
    { icon: <FaMeh color='grey' size={25} key="meh" />, id: 10 },
    { icon: <FaFrown color='darkgrey' size={25} key="frown" />, id: 11 },
    { icon: <FaKissWinkHeart color='lightpink' size={25} key="kiss" />, id: 12 },
    { icon: <FaCoffee color='brown' size={25} key="coffee" />, id: 13 },
    { icon: <FaAppleAlt color='red' size={25} key="apple" />, id: 14 },
    { icon: <FaBook color='blue' size={25} key="book" />, id: 15 },
  ];

  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex].icon;
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  React.useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('selectedUser') || 'null');
    if (storedUser && setSelectedUser) {
      setSelectedUser(storedUser);
    }
  }, [setSelectedUser]);

  React.useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('selectedUser');
    }
  }, [selectedUser]);

  const filteredUsers = users?.filter(user => 
    user._id !== authUser?._id && 
    user.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <section className="users">
      {loadingUsers ? (
        <MoonLoader color='#b0b0b0' className='users-loader' />
      ) : (
        filteredUsers?.map((user) => (
          <div 
            key={user.id} 
            className={`user ${selectedUser?._id === user._id ? 'selected-user' : ''}`} 
            onClick={() => handleUserSelect(user)}
          >
            <div className="user-meta">
              <img src={user.profilePicture} className='profile-picture' alt={`${user.username}'s profile`} />
              <div className={onlineUsers.includes(user._id) ? 'online' : ''}></div>
              <div className="username">
                {user.username} 
                <span>
                  Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className="random-emoji">
              {getRandomEmoji()}
            </div>
          </div>
        ))
      )}
      {searchUser && filteredUsers?.length === 0 && !loadingUsers && (
        <p className="no-match">
          No user(s) found with the username(s) "{searchUser}"
        </p>
      )}
    </section>
  );
};

export default UsersFixed;
