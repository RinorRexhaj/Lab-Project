import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductImage from "./ProductImage";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const Element = ({
  type,
  id,
  admin,
  name,
  category,
  price,
  email,
  openModal,
  setModalAction,
  setEditData,
  setDeleteId,
}) => {
  return (
    <div className="relative w-full py-6 px-8  sm:px-4 flex md:flex-wrap items-center justify-between gap-4">
      <div className="w-1/3 md:w-3/5 text-black font-medium text-sm flex items-center gap-5 sm:gap-2">
        {(type !== "Categories" || type !== "Models") && (
          <ProductImage
            src={`https://localhost:7262/${type}/image/` + id}
            alt={name}
            type={type}
          />
        )}
        <p className="text-balance">{name}</p>
      </div>
      {(type !== "Categories" || type !== "Models") && (
        <>
          <div
            className={`${
              type === "Products" ? "w-1/4" : "w-1/6"
            } md:hidden text-black  text-sm font-medium`}
          >
            {category}
          </div>
          <div className="w-1/6 text-black text-sm font-medium">
            <p className="font-bold">
              {type === "Products" ? `Price: $${price}` : `${email}`}
            </p>
          </div>
        </>
      )}
      {admin === "Admin" && (
        <div className="w-1/4 flex items-center gap-4  md:gap-2">
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium sm:text-sm bg-blue-500 hover:bg-blue-600 duration-150 ease-linear text-white"
            onClick={() => {
              openModal();
              setEditData(
                type === "Clients"
                  ? {
                      id: id,
                      name: name,
                      categoryName: category,
                      email: email,
                      image: `https://localhost:7262/${type}/image/` + id,
                    }
                  : {
                      id: id,
                      name: name,
                      categoryName: category,
                      price: price,
                      image: `https://localhost:7262/${type}/image/` + id,
                    }
              );
              setModalAction("EDIT");
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} /> EDIT
          </button>
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium  sm:text-sm bg-red-500 hover:bg-red-600 duration-150 ease-linear text-white"
            onClick={() => {
              if (type !== "Categories" || type !== "Models") setDeleteId(id);
              else if (type === "Categories")
                setEditData({ categoryName: name });
              else if (type === "Models") setEditData({ name: name });
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
