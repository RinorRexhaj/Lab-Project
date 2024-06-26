import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faCircleCheck,
  faPenToSquare,
  faPlus,
  faRightFromBracket,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CategoryModal = ({
  action,
  token,
  setToken,
  user,
  setUser,
  setSession,
  modalVisible,
  elements,
  setElements,
  elementsFilter,
  setElementsFilter,
  closeModal,
  postData,
  setPostData,
  editData,
  setEditData,
  deleteId,
}) => {
  const [actionDone, setActionDone] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const postCategory = async () => {
    if (category === null || category === undefined || category.length <= 0) {
      setCategoryError("Invalid Category!");
      return false;
    }
    let status;
    const { data } = await axios
      .post(
        `https://localhost:7262/Categories`,
        {
          categoryName: category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        if (resp.status === 200) status = true;
      })
      .catch((err) => {
        console.log(err);
        status = false;
      });
    return status;
  };

  const editCategory = async () => {
    const { data } = await axios.patch(
      `https://localhost:7262/Categories`,
      {
        oldCategory: editData.categoryName,
        newCategory: category,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const deleteCategory = async () => {
    const { data } = await axios.delete(
      `https://localhost:7262/Categories/${editData.categoryName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "DELETE" && category !== null) {
      deleteCategory();
    } else if (action === "POST") {
      await postCategory();
    } else if (action === "EDIT") {
      await editCategory();
    }
    setTimeout(() => setActionDone(true), 300);
    setTimeout(() => {
      closeModal();
      setActionDone(false);
      navigate(0);
    }, 1000);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        modalVisible ? "opacity-100 z-50" : "opacity-0 -z-99"
      } transition-opacity duration-200 ease-in`}
    >
      <div className="bg-white p-8 rounded-md z-50 w-100 md:w-80">
        <div className="relative items-center gap-6">
          <h2 className="relative text-3xl md:text-2xl mb-8 font-bold text-slate-800">
            {!actionDone
              ? `${action[0] + action.slice(1).toLowerCase()} Your Category`
              : `Your category was ${
                  action !== "DELETE"
                    ? action[0] + action.slice(1).toLowerCase() + "ed"
                    : action[0] + action.slice(1).toLowerCase() + "d"
                }`}
          </h2>
          {actionDone && (
            <FontAwesomeIcon
              className="w-7 h-7 m-auto text-green-500 animate-ping-once"
              icon={faCircleCheck}
            />
          )}
          <button
            className="absolute -top-6 -right-4 text-4xl"
            onClick={() => {
              if (action !== "DELETE") {
                setCategory("");
              }
              closeModal();
            }}
          >
            &times;
          </button>
        </div>

        {!actionDone && (
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {action !== "DELETE" && (
              <div className="flex items-center justify-between">
                <label
                  htmlFor="name"
                  className=" text-lg font-bold text-slate-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="w-60 md:w-40 appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500 focus:shadow-outline bg-blue-50 border  border-slate-200"
                  id="name"
                  placeholder="Product name..."
                  defaultValue={action === "EDIT" ? editData.categoryName : ""}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  required
                />
                <div className="h-1 absolute bottom-0 left-25 text-red-500 font-medium text-md">
                  {categoryError}
                </div>
              </div>
            )}
            {action === "DELETE" ? (
              <h1 className="text-xl font-medium text-center">
                Are you sure you want to{" "}
                {action === "DELETE"
                  ? `delete category "${editData.categoryName}"`
                  : ""}{" "}
                ?
              </h1>
            ) : (
              ""
            )}

            <button
              className={`w-35 md:w-25 h-10 flex items-center justify-center gap-2 rounded-md font-medium ${
                action !== "DELETE"
                  ? "bg-blue-600 hover:bg-blue-500"
                  : "bg-red-600 hover:bg-red-500"
              } duration-150 ease-linear text-white ml-25`}
              type="submit"
            >
              <FontAwesomeIcon
                icon={
                  action === "POST"
                    ? faPlus
                    : action === "EDIT"
                    ? faPenToSquare
                    : action === "DELETE"
                    ? faTrash
                    : faRightFromBracket
                }
              />{" "}
              {action}{" "}
            </button>
          </form>
        )}
      </div>
      <div className="overlay fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default CategoryModal;
