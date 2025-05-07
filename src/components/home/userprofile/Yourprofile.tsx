

import '../../../styles/components/userprofile.scss';
import { IoMdClose } from "react-icons/io";
import { FaPen } from "react-icons/fa";
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';

const Yourprofile = () => {

  const {setShowYourProfile, authUser, setShowEditProfile}= useContext(VaarbzContext);
  return (
    <section className="userprofile">
    <IoMdClose  className='close-icon' size={25} onClick={()=> setShowYourProfile(false)}/>
   <div className="userprofile-content">

        
 

      
        <img src={authUser.user.profilePicture} className='profile-picture' />
        <p className="username-age">{authUser.user.username} (You) , {authUser.user.age}</p>
        <p className="status">{authUser.user.status}</p>
        <p className="gender-city">{authUser.user.gender}, {authUser.user.city}</p>
        <button className="editprofile" onClick={()=> {setShowEditProfile(true)
         setShowYourProfile(false)


        }}>Edit Profile <FaPen />
        </button>

        
   </div>


 </section>
  )
}

export default Yourprofile