import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faBarcode, faCartShopping, faUserGroup } from "@fortawesome/free-solid-svg-icons"
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({destination}) => {
    let icon = ""

    let location = useLocation().pathname
    let selected = false
    if(location === "/"+destination) selected = true

    switch(destination) {
        case "Dashboard":
            icon = faBars
            break
        case "Products":
            icon = faBarcode
            break
        case "Clients":
            icon = faUserGroup
            break
        case "Orders":
            icon = faCartShopping
            break
    }

    return (
            <Link to={`/${destination}`} className={`w-full h-10 py-2 px-4 flex gap-3 items-center ${selected ? 'bg-slate-700' : 'bg-inherit'} font-medium text-slate-200 text-l rounded-sm hover:bg-slate-500 duration-150 ease-linear`}>
                <FontAwesomeIcon icon={icon} />
                {destination}
            </Link>
    );
};

export default SidebarLink;
