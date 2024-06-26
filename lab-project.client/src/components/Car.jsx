import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CarImage from "./CarImage";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const Car = ({
  id,
  name,
  user,
  modelName,
  price,
  mileage,
  engine,
  openModal,
  setModalAction,
  setEditData,
  setDeleteId,
}) => {
  return (
    <div className="relative w-full py-6 px-8  sm:px-4 flex md:flex-wrap items-center justify-between gap-4">
      <div className="w-1/3 md:w-3/5 text-black font-medium text-sm flex items-center gap-5 sm:gap-2">
        <CarImage src={"https://localhost:7262/Cars/image/" + id} alt={name} />
        <p className="text-balance">{name}</p>
      </div>
      <div className="w-1/4 md:hidden text-black  text-sm font-medium">
        {modelName}
      </div>
      <div className="w-1/6 text-black text-sm font-medium">${price}</div>
      <div className="w-1/6 text-black text-sm font-medium">{mileage} km</div>
      <div className="w-1/6 text-black text-sm font-medium">
        {engine.toFixed(1)} L
      </div>
      {user.role === "Admin" && (
        <div className="w-1/4 flex items-center gap-4  md:gap-2">
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium sm:text-sm bg-blue-500 hover:bg-blue-600 duration-150 ease-linear text-white"
            onClick={() => {
              openModal();
              setEditData({
                id: id,
                name: name,
                modelName: modelName,
                price: price,
                mileage: mileage,
                engine: engine,
                image: "https://localhost:7262/Car/image/" + id,
              });
              setModalAction("EDIT");
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} /> EDIT
          </button>
          <button
            className="h-10 p-2 flex items-center gap-2 rounded-md font-medium  sm:text-sm bg-red-500 hover:bg-red-600 duration-150 ease-linear text-white"
            onClick={() => {
              setDeleteId(id);
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

export default Car;
