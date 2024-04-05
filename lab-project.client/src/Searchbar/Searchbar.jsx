import { faBars, faMagnifyingGlass, faBell, faMessage, faUser, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Searchbar = ({ toggleSidebar }) => {
  return (
      <nav className="w-full flex items-center justify-between mb-4 h-25 shadow-2 pl-7 pr-4">
        <FontAwesomeIcon icon={faBars} className="cursor-pointer hidden tb:block w-6 h-6 absolute" onClick={() => toggleSidebar()}/>
        <div className="w-full flex items-center gap-4.5 tb:relative tb:left-15 sm:hidden">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-6 h-6 text-slate-600"/>
          <input
            type="text"
            placeholder="Type to search..."
            className="outline-none p-3 w-7/12 border-b-2 border-slate-200"
          />
        </div>
        <div className="flex gap-5 md:gap-3 sm:absolute sm:right-0">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-slate-600 bg-slate-300  hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
            <FontAwesomeIcon icon={faMessage} className="w-5 h-5 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
            {/* posht eshte ikona e profilit, duhet me shti si foto e adminit qe eshte login ma von */}
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
            <FontAwesomeIcon icon={faAngleDown} className="w-5 h-5 text-slate-600  hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
        </div>
      </nav>
  );
};

export default Searchbar;