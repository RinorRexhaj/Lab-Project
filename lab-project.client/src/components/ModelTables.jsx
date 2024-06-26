import { useState, useEffect } from "react";
import Element from "./Element";
import CarModal from "./CarModal";
import Loader from "./Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown19,
  faArrowDown91,
  faArrowDownAZ,
  faArrowDownZA,
  faFilter,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ModelModal from "../Models/ModelModal";

const ModelTables = ({
  type,
  token,
  setToken,
  user,
  data,
  setData,
  dataFilter,
  setDataFilter,
  loading,
  emptyResults,
  setEmptyResults,
  setModel,
  search,
}) => {
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
  const [models, setModels] = useState([]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const filterByModel = (model) => {
    setModel(model);
    if (model !== "All Models") {
      let filtered;
      if (search === "") {
        filtered = data.filter((data) => data.modelName === model);
      } else {
        filtered = data.filter(
          (data) =>
            data.modelName === model && data.name.toLowerCase().includes(search)
        );
      }
      setEmptyResults(filtered.length === 0);
      setDataFilter(filtered);
    } else {
      setEmptyResults(false);
      if (search === "") {
        setDataFilter(data);
      } else {
        let filtered = data.filter((d) =>
          d.name.toLowerCase().includes(search)
        );
        setDataFilter(filtered);
      }
    }
  };

  useEffect(() => {
    const response = axios
      .get("https://localhost:7262/Models", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => setModels(resp.data));
  }, []);

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

  let prd =
    dataFilter === undefined || dataFilter.length === 0 ? data : dataFilter;
  switch (sort) {
    case "id":
      prd = prd.sort((a, b) => a.id - b.id);
      break;
    case "name-asc":
      prd = prd.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      prd = prd.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "modelName-asc":
      prd = prd.sort((a, b) => a.modelName.localeCompare(b.modelName));
      break;
    case "modelName-desc":
      prd = prd.sort((a, b) => b.modelName.localeCompare(a.modelName));
      break;
    case "price-asc":
      prd = prd.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      prd = prd.sort((a, b) => b.price - a.price);
      break;
  }
  console.log(prd);

  return (
    <div className="w-full relative min-h-125 shadow-2 bg-white flex flex-col">
      <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">Top {type}</h1>
        <button
          className="w-35 md:w-25 h-10 flex items-center justify-center gap-2 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white"
          onClick={() => {
            openModal();
            setEditData({
              id: "",
              name: "",
              model: "",
              price: "",
              image: "",
            });
            setModalAction("POST");
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add{" "}
          <p className="md:hidden">
            {type !== "Models" ? type.substring(0, type.length - 1) : "Model"}
          </p>
        </button>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      <div className="w-full py-6 px-8 sm:px-4 flex items-center justify-between bg-white gap-4">
        <p
          className={`w-1/3 md:w-3/5 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${
            sort.includes("name") || sort.includes("modelName")
              ? "text-slate-900 font-semibold"
              : ""
          }`}
          onClick={() => {
            let sortType =
              type !== "Models"
                ? sort == "name-asc"
                  ? "name-desc"
                  : "name-asc"
                : sort == "modelName-asc"
                ? "modelName-desc"
                : "modelName-asc";
            setSort(sortType);
          }}
        >
          {type !== "Models" ? type.substring(0, type.length - 1) : "Model"}{" "}
          Name{" "}
          <FontAwesomeIcon
            icon={sort !== "name-asc" ? faArrowDownZA : faArrowDownAZ}
            className="relative w-5 h-5 left-5"
          />
        </p>
        {type !== "Models" && (
          <div className="w-1/4 relative flex items-center">
            <select
              className="w-35 relative md:hidden text-slate-500 font-medium select-none hover:text-slate-700 duration-150 ease-linear cursor-pointer focus:outline-1"
              id="model"
              onChange={(e) => {
                filterByModel(e.target.value);
              }}
              required
            >
              <option>All Models</option>
              {models.map((model) => {
                return (
                  <option key={model.modelName} value={model.modelName}>
                    {model.modelName}
                  </option>
                );
              })}
            </select>
            <FontAwesomeIcon
              icon={faFilter}
              className="absolute left-31 -z-10 md:hidden text-slate-500"
            />
          </div>
        )}
        {type !== "Models" && (
          <p
            className={`w-1/6 relative text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${
              sort.includes("price") ? "text-slate-900 font-semibold" : ""
            }`}
            onClick={() => {
              let sortType = sort == "price-asc" ? "price-desc" : "price-asc";
              setSort(sortType);
            }}
          >
            Price{" "}
            <FontAwesomeIcon
              icon={sort == "price-asc" ? faArrowDown19 : faArrowDown91}
              className="relative w-5 h-5 left-5"
            />
          </p>
        )}
        {user.role === "Admin" && (
          <p
            className={`w-1/4 text-slate-500 md:hidden font-medium select-none`}
          >
            Actions
          </p>
        )}
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      {loading ? (
        <Loader />
      ) : emptyResults ? (
        <h1 className="relative m-auto bottom-10 text-3xl font-bold">
          No results
        </h1>
      ) : (
        prd.map((car) => {
          return (
            <Element
              type={type}
              key={type !== "Models" ? car.id : car.modelName}
              role={user.role}
              id={car.id}
              image={car.image}
              name={type !== "Models" ? car.name : car.modelName}
              model={car.modelName}
              price={car.price}
              openModal={openModal}
              setModalAction={setModalAction}
              setEditData={setEditData}
              setDeleteId={setDeleteId}
            />
          );
        })
      )}
      {type !== "Models" ? (
        <Modal
          action={modalAction}
          token={token}
          setToken={setToken}
          user={user}
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
      ) : (
        <ModelModal
          action={modalAction}
          token={token}
          user={user}
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
      )}
    </div>
  );
};

export default ModelTables;
