import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductImage from "./ProductImage";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const Element = ({
  type,
  id,
  role,
  name,
  category,
  price,
  openModal,
  setModalAction,
  setEditData,
  setDeleteId,
}) => {
  return (
    <div className="relative w-full py-6 px-8  sm:px-4 flex md:flex-wrap items-center justify-between gap-4">
      <div className="w-1/3 md:w-3/5 text-black font-medium text-sm flex items-center gap-5 sm:gap-2">
        {type !== "Models" && <ProductImage
          src={`https://localhost:7262/${type}/image/` + id}
          alt={name}
        />}
        <p className="text-balance">{name}</p>
      </div>
      <div className="w-1/4 md:hidden text-black  text-sm font-medium">
        {category}
      </div>
      {type !== "Models" && <div className="w-1/6 text-black text-sm font-medium">
        <p className="font-bold">
          {type == "Products" ? `Price: $${price}` : `Visits: ${name.length}`}
        </p>
      </div>}
      {role === "Admin" && (
        <div className="w-1/4 flex items-center gap-4  md:gap-2">
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium sm:text-sm bg-blue-500 hover:bg-blue-600 duration-150 ease-linear text-white"
            onClick={() => {
              openModal();
              setEditData({
                id: id,
                name: name,
                categoryName: category,
                price: price,
                image: "https://localhost:7262/Element/image/" + id,
              });
              setModalAction("EDIT");
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} /> EDIT
          </button>
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium  sm:text-sm bg-red-500 hover:bg-red-600 duration-150 ease-linear text-white"
            onClick={() => {
              if(type !== "Models") setDeleteId(id);
              else setEditData({name: name})
              openModal();
              setModalAction("DELETE");
            }}
          >
            <FontAwesomeIcon icon={faTrash} /> DELETE
          </button>
        </div>
      )}
      <span className="w-11/12 absolute bottom-0 h-[1px] bg-slate-200"></span>
    </div>
  );
};

export default Element;
