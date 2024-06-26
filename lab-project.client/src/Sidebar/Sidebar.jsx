import SidebarLink from "./SidebarLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ open, toggleSidebar, role }) => {
  return (

    <div
      className={`w-80 h-full left-0 top-0 flex flex-col z-99 align-middle px-6 py-8 bg-black duration-300 ease-linear gap-20 tb:w-60 tb:-left-${
        open ? "0" : "60"
      } tb:fixed  md:w-50 sm:fixed sm:w-50 sm:gap-10`}
    >
      <div className="flex gap-2 items-center justify-between text-slate-200">
        <h1 className="text-3xl font-semibold">Lab Project</h1>
        <img
          src="src/assets/img/logo1.png"
          alt=""
          className="w-9 h-9 md:hidden"
        />
        <FontAwesomeIcon
          icon={faLeftLong}
          className="cursor-pointe z-99 hidden tb:flex text-2xl"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-col py-2 px-4 gap-2.5">
        <p className="text-slate-400    font-medium">MENU</p>
        <SidebarLink destination={"Dashboard"} />
        <SidebarLink destination={"Products"} />
        {role === "Admin" && <SidebarLink destination={"Clients"} />}
        <SidebarLink destination={"Orders"} />
        {role==="Admin" && <SidebarLink destination={"Cars"} />}
        {role==="Admin" && <SidebarLink destination={"Car Dashboard"} />}
        {role === "User" &&<SidebarLink destination={"Rents"} />}
        <SidebarLink destination={"Car Reservations"} />
        {role==="Admin" && <SidebarLink destination={"Models"} />}
      </div>
      
    </div>
  );
};

export default Sidebar;
