import { faArrowRightToBracket, faBars, faMagnifyingGlass, faBell, faMessage, faUser, faAngleDown, faAngleUp, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Searchbar = ({ toggleSidebar, data, setDataFilter }) => {
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  }

  const filterBySearch = (e) => {
    let search = e.target.value.toLowerCase();
    let filteredProducts = data.filter(product => product.name.toLowerCase().includes(search));
    setDataFilter(filteredProducts);
  }

  return (
      <nav className="w-full flex items-center justify-between mb-4 min-h-25 shadow-4 pl-7 pr-4 bg-white">
        <FontAwesomeIcon icon={faBars} className="cursor-pointer hidden tb:block w-6 h-6 absolute z-10" onClick={toggleSidebar}/>
        <div className="w-full flex z-10 items-center gap-4.5 tb:relative tb:left-15 sm:hidden">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-6 h-6 text-slate-600"/>
          <input
            type="text"
            placeholder="Type to search..."
            className="outline-none p-3 w-7/12 border-b-2 border-slate-200 opacity-100"
            onInput={filterBySearch}
          />
        </div>
        <div className="flex gap-5 md:gap-3 sm:absolute sm:right-0 z-10">
            <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-slate-600 bg-slate-300  hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
            <FontAwesomeIcon icon={faMessage} className="w-5 h-5 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"/>
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer" onClick={toggleMenu}/>
            <FontAwesomeIcon icon={menu ? faAngleUp : faAngleDown} className="w-5 h-5 text-slate-600  p-3 rounded-full cursor-pointer" onClick={toggleMenu}/>
        </div>
        <div className={`w-60 md:w-50 flex flex-col items-start absolute bg-white top-[101px] right-10 shadow-2 p-4 gap-5 ${menu ? 'opacity-100 z-9' : 'opacity-0 -z-9'} duration-200 ease-linear`}>
          <Link className="w-full flex items-center gap-4 text-slate-500 font-medium hover:text-blue-500 duration-150 ease-in">
            <FontAwesomeIcon icon={faUser}/>
            <p>My Profile</p>
          </Link>
          <Link to="/settings" className="w-full flex items-center gap-4 text-slate-500 font-medium hover:text-blue-500 duration-150 ease-in">
            <FontAwesomeIcon icon={faGear}/>
            <p>Account Settings</p>
          </Link>
          <span className="h-[1px] w-full bg-slate-300"></span>
          <Link className="w-full flex items-center gap-4 text-slate-500 font-medium hover:text-blue-500 duration-150 ease-in">
            <FontAwesomeIcon icon={faArrowRightToBracket} className="rotate-180"/>
            <p>Log Out</p>
          </Link>
        </div>
      </nav>
  );
};

export default Searchbar;