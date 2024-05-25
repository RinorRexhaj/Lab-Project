import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBarcode,
  faCartShopping,
  faUserGroup,
  faList,
  faCar,
  faAngleDown,
  faAngleUp,
  faCarSide,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({ destination }) => {
  let icon = "";

  let location = useLocation().pathname.toLowerCase();
  let selected = false;
  if (location === "/" + destination.toLowerCase()) {
    selected = true;
  }

  switch (destination) {
    case "Dashboard":
      icon = faBars;
      break;
    case "Products":
      icon = faBarcode;
      break;
    case "Clients":
      icon = faUserGroup;
      break;
    case "Orders":
      icon = faCartShopping;
      break;
    case "Categories":
      icon = faList;
      break;
    case "Cars":
      icon = faCar;
      break;
    case "Rents":
      icon = faCarSide;
      break;
  }

  return (
    <Link
      to={`/${destination}`}
      className={`relative w-full h-10 py-2 px-4 flex gap-3 items-center ${
        selected ? "bg-slate-700" : "bg-inherit"
      } font-medium text-slate-200 text-l rounded-sm hover:bg-slate-500 duration-150 ease-linear sm:px-2`}
    >
      <FontAwesomeIcon icon={icon} />
      {destination}
    </Link>
  );
};

export default SidebarLink;
