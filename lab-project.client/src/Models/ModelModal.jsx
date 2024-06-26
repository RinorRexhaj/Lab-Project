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

const ModelModal = ({ action, token, modalVisible, closeModal, editData }) => {
  const [actionDone, setActionDone] = useState(false);
  const [model, setModel] = useState("");
  const [modelError, setModelError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const postModel = async () => {
    if (model === null || model === undefined || model.length <= 0) {
      setModelError("Invalid Model!");
      return false;
    }
    let status;
    const repsonse = await axios
      .post(
        `https://localhost:7262/Models`,
        {
          modelName: model,
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

  const editModel = async () => {
    const { data } = await axios.patch(
      `https://localhost:7262/Models`,
      {
        oldModel: editData.name,
        newModel: model,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const deleteModel = async () => {
    const { data } = await axios.delete(
      `https://localhost:7262/Models/${editData.name}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (action === "DELETE" && model !== null) {
      deleteModel();
    } else if (action === "POST") {
      await postModel();
    } else if (action === "EDIT") {
      await editModel();
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
              ? `${action[0] + action.slice(1).toLowerCase()} Your Model`
              : `Your model was ${
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
                setModel("");
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
                  placeholder="Car name..."
                  defaultValue={action === "EDIT" ? editData.name : ""}
                  onChange={(e) => {
                    setModel(e.target.value);
                  }}
                  required
                />
                <div className="h-1 absolute bottom-0 left-25 text-red-500 font-medium text-md">
                  {modelError}
                </div>
              </div>
            )}
            {action === "DELETE" ? (
              <h1 className="text-xl font-medium text-center">
                Are you sure you want to{" "}
                {action === "DELETE" ? `delete model "${editData.name}"` : ""} ?
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

export default ModelModal;
