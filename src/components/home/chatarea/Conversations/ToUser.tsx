

import '../../../../styles/components/chatarea.scss';
import { VaarbzContext } from '../../../store/VaarbzContext';
import { useContext } from 'react'
//import useListenMessages from '@/app/hooks/useListenMessages'
import { IoMenuOutline } from 'react-icons/io5'


const ToUser = () => {

  const {selectedUser, setShowUserProfile, setOpenSidebar, openSidebar, typingUsers}= useContext(VaarbzContext);
  
 
  return (
    <section className="to-user"  onClick={()=> setShowUserProfile(true)}>

         <div className="touser-content">

            <div className="profile-picture" ><img src={selectedUser.profilePicture} className='profile-picture' />
            </div>

            <div className="user-info">

              <p className="username">{selectedUser.username}</p>
              <p className="status">
            {typingUsers.has(selectedUser._id) ? 'typing...' : selectedUser.status}
          </p>
            </div>
            <button
  className="users-button2"
  onClick={(e) => {
    e.stopPropagation(); // Prevent the event from propagating to the parent
    setOpenSidebar(!openSidebar);
  }}
>
  <IoMenuOutline size={30} className="chat-icon" />
</button>        
       

         </div>
    </section>
  )
}

export default ToUser