import SidebarLink from "./SidebarLink"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faLeftLong, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({open, toggleSidebar}) => {
    return (
        <div className={`w-80 h-full left-0 top-0 flex flex-col z-99 align-middle px-6 py-8 bg-black duration-300 ease-linear gap-20 tb:w-60 tb:-left-${open ? '0' : '60'} tb:fixed  md:w-50 sm:fixed sm:w-50 sm:gap-10`}>
            <div className="flex gap-2 items-center justify-between text-slate-200">
                <h1 className="text-3xl font-semibold">Lab Project</h1>
                <FontAwesomeIcon icon={faLeftLong} className="cursor-pointer hidden tb:flex text-2xl" onClick={() => toggleSidebar()}/>
            </div>
            <div className="hidden w-full items-center gap-2 sm:flex">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-slate-600"/>
                <input
                    type="text"
                    placeholder="Type to search..."
                    className="outline-none py-2 w-full border-b-2 text-slate-200 border-slate-700 bg-transparent"
                />
            </div>
            <div className="flex flex-col py-2 px-4 gap-2.5">
                <p className="text-slate-400    font-medium">MENU</p>
                <SidebarLink destination={"Dashboard"}/>
                <SidebarLink destination={"Products"}/>
                <SidebarLink destination={"Clients"}/>
                <SidebarLink destination={"Orders"}/>
            </div>
        </div>
    )
}

export default Sidebar