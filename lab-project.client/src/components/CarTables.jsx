import { useState, useEffect } from "react";
import Car from "./Car";
import CarModal from "./CarModal";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const CarTables = ({ type, data, setData, dataFilter, loading }) => {
  const [sort, setSort] = useState("id");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("POST");
  const [postData, setPostData] = useState({
    id: "",
    name: "",
    modelName: "",
    price: "",
    image: "",
  });
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    modelName: "",
    price: "",
    image: "",
  });
  const [deleteId, setDeleteId] = useState("");

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //Modal Handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutsideModal = (event) => {
      if (event.target.classList.contains("overlay")) {
        closeModal();
      }
    };

    if (modalVisible) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("click", handleClickOutsideModal);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [modalVisible]);

  let car = dataFilter.length === 0 ? data : dataFilter;
  switch (sort) {
    case "id":
      car = car.sort((a, b) => a.id - b.id);
      break;
    case "name-asc":
      car = car.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      car = car.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "model-asc":
      car = car.sort((a, b) => a.modelName.localeCompare(b.modelName));
      break;
    case "model-desc":
      car = car.sort((a, b) => b.modelName.localeCompare(a.modelName));
      break;
    case "price-asc":
      car = car.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      car = car.sort((a, b) => b.price - a.price);
      break;
  }

  return (
    <div className="w-full min-h-125 shadow-2 bg-white flex flex-col">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">Top {type}</h1>
        <button
          className="w-35 md:w-25 h-10 flex items-center justify-center gap-2 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white"
          onClick={() => {
            openModal();
            setEditData({
              id: "",
              name: "",
              modelName: "",
              price: "",
              image: "",
            });
            setModalAction("POST");
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add{" "}
          <p className="md:hidden">{type.substring(0, type.length - 1)}</p>
        </button>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      <div className="w-full py-6 px-8 sm:px-4 flex items-center justify-between bg-white gap-4">
        <p
          className={`w-1/3 md:w-3/5 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${
            sort.includes("name") ? "text-slate-900 font-semibold" : ""
          }`}
          onClick={() => {
            let sortType = sort == "name-asc" ? "name-desc" : "name-asc";
            setSort(sortType);
          }}
        >
          {type.substring(0, type.length - 1)} Name{" "}
          <FontAwesomeIcon
            icon={sort == "name-asc" ? faAngleUp : faAngleDown}
          />
        </p>
        <p
          className={`w-1/4 md:hidden text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${
            sort.includes("model") ? "text-slate-900 font-semibold" : ""
          }`}
          onClick={() => {
            let sortType = sort == "model-asc" ? "model-desc" : "model-asc";
            setSort(sortType);
          }}
        >
          Model{" "}
          <FontAwesomeIcon
            icon={sort == "model-asc" ? faAngleUp : faAngleDown}
          />
        </p>
        <p
          className={`w-1/6 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${
            sort.includes("price") ? "text-slate-900 font-semibold" : ""
          }`}
          onClick={() => {
            let sortType = sort == "price-asc" ? "price-desc" : "price-asc";
            setSort(sortType);
          }}
        >
          Price{" "}
          <FontAwesomeIcon
            icon={sort == "price-asc" ? faAngleUp : faAngleDown}
          />
        </p>
        <p className={`w-1/4 text-slate-500 md:hidden font-medium select-none`}>
          Actions
        </p>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      {loading ? (
        <Loader />
      ) : (
        car.map((c) => {
          return (
            <Car
              key={c.id}
              id={c.id}
              image={c.image}
              name={c.name}
              modelName={c.modelName}
              price={c.price}
              openModal={openModal}
              setModalAction={setModalAction}
              setEditData={setEditData}
              setDeleteId={setDeleteId}
            />
          );
        })
      )}
      <CarModal
        action={modalAction}
        closeModal={closeModal}
        modalVisible={modalVisible}
        elements={data}
        setElements={setData}
        postData={postData}
        setPostData={setPostData}
        editData={editData}
        setEditData={setEditData}
        deleteId={deleteId}
      />
    </div>
  );
};

export default CarTables;
