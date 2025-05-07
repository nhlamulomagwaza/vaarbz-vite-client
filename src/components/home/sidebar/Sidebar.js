import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import '../../../styles/components/sidebar.scss';
import Search from './Search';
import Users from './Users';
import Admin from './Admin';
import { VaarbzContext } from '../../store/VaarbzContext';
const Sidebar = () => {
    const { openSidebar } = React.useContext(VaarbzContext);
    return (_jsx(_Fragment, { children: _jsx("section", { className: ` ${openSidebar ? 'sidebar-open' : 'sidebar'}`, children: _jsxs("div", { className: "sidebar-container", children: [_jsx(Search, {}), _jsx(Users, {}), _jsx(Admin, {})] }) }) }));
};
export default Sidebar;
