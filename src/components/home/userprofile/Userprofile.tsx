
import '../../../styles/components/userprofile.scss';
import { IoMdClose } from "react-icons/io";
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';
const Userprofile = () => {



  const {userProfile, setShowUserProfile, selectedUser }= useContext(VaarbzContext);
  return (
   <section className="userprofile">
      <IoMdClose  className='close-icon' size={25} onClick={()=> setShowUserProfile(false)}/>
     <div className="userprofile-content">

          
   

        
          <img src={selectedUser.profilePicture} className='profile-picture' />
          <p className="username-age">{selectedUser.username} , {selectedUser.age}</p>
          <p className="status">{selectedUser.status}</p>
          <p className="gender-city">{selectedUser.gender}, {selectedUser.city}</p>
        

          
     </div>


   </section>
  )
}

export default Userprofile