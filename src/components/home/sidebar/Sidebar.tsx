
import React from 'react'

import '../../../styles/components/sidebar.scss';
import Search from './Search';
import Users from './Users';
import Admin from './Admin';
import { VaarbzContext } from '../../store/VaarbzContext';
const Sidebar = () => {

  const { openSidebar } = React.useContext(VaarbzContext);
  return (
    <>
    
      <section className={` ${openSidebar ? 'sidebar-open' : 'sidebar'}`}>
    <div className="sidebar-container">

      <Search/>
      <Users/>
      <Admin/>
</div>
    </section>
    
    </>
  )
}

export default Sidebar