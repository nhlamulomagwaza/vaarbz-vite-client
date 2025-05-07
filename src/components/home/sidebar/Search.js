import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { IoMdSearch } from "react-icons/io";
import '../../../styles/components/sidebar.scss';
import { VaarbzContext } from '../../store/VaarbzContext';
import { useContext } from 'react';
const Search = () => {
    const { searchUser, setSearchUser } = useContext(VaarbzContext);
    return (_jsx(_Fragment, { children: _jsxs("section", { className: "search", children: [_jsx("input", { type: "text", className: 'search-input', placeholder: 'search or start a new chart', value: searchUser, onChange: (e) => setSearchUser(e.target.value) }), _jsx(IoMdSearch, { color: 'rgb(184, 184, 184)', size: 20, className: 'search-icon' })] }) }));
};
export default Search;
