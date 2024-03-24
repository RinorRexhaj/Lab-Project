import SidebarLink from "./SidebarLink"

const Sidebar = () => {

    return (
        <div className="w-80 h-full z-10 left-0 top-0 flex flex-col align-middle p-6 bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 gap-20">
            <h1 className="text-3xl font-semibold flex justify-center text-slate-200">Lab Project</h1>
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