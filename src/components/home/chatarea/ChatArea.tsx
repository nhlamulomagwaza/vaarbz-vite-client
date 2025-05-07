'use client'
import React, { useContext } from 'react'
import '../../../styles/components/chatarea.scss';
import ToUser from './Conversations/ToUser';
import TextArea from './Conversations/TextArea'
import Conversations from './Conversations/Conversations'
import WelcomeScreen from './WelcomeScreen'
import { VaarbzContext } from '../../store/VaarbzContext'

const ChatArea = () => {

  const {selectedUser, users}= useContext(VaarbzContext);

  return (
    <>
     <section className="chat-area">
      

     
        
     
      {selectedUser ? (
        <>
        <ToUser/> 

 <Conversations/> 
   <TextArea/> 
   </>
  ):  <WelcomeScreen/>  }
     </section>
    </>
  )
}

export default ChatArea