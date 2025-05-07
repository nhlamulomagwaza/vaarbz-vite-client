'use client'
import React, { useContext } from 'react'
import { IoIosChatboxes } from "react-icons/io";
import '../../../styles/components/chatarea.scss';
import { IoChatbubblesSharp, IoPersonOutline } from "react-icons/io5";
import { VaarbzContext } from '../../store/VaarbzContext';


const WelcomeScreen = () => {

  const {authUser, openSidebar, setOpenSidebar}= useContext(VaarbzContext);
  return (
    <>
    
    <section className="welcome-screen">

             <button className='users-button' onClick={() => setOpenSidebar(!openSidebar)}>Users <IoPersonOutline /></button>
         <div className="welcome-screen-content">
            
              <h1 className="welcome-title">Welcome✌️ {authUser?.user?.username} 😁</h1>
              <p className="welcome-descption">Select a user to start messaging</p>
          
                   <IoChatbubblesSharp size={30} className='chat-icon'/>
            </div> 
    </section>
    </>
  )
}

export default WelcomeScreen