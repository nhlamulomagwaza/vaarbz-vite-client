

import { IoMdSearch } from "react-icons/io";
import '../../../styles/components/sidebar.scss';
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';
const Search = () => {

  const {searchUser, setSearchUser}= useContext(VaarbzContext);
  return (
  
<>
<section className="search">
<input type="text" className='search-input' placeholder='search or start a new chart' value={searchUser}
onChange={(e) => setSearchUser(e.target.value)} />
       <IoMdSearch color='rgb(184, 184, 184)' size={20} className='search-icon'/>
       </section>
       </>
   
  )
}

export default Search