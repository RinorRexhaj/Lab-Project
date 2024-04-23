import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Modal = ({action, modalVisible, closeModal, elements, setElements, postData, setPostData, editData, setEditData, deleteId}) => {
  const [productImage, setProductImage] = useState(new FormData);
  const [idError, setIdError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [actionDone, setActionDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

    const postProduct = async () => {
      const { data } = await axios.post(`https://localhost:7262/Products`, {
        id: postData.id,
        name: postData.name,
        category: postData.category,
        price: postData.price,
      });
      setElements([...elements, data]);
    }

    const editProduct = async () => {
      const { data } = await axios.patch(`https://localhost:7262/Products`, editData);
      setElements([...elements.filter(el => el.id !== data.id), {...data, }]);
      // setElements([...data, editedElement]);
    }
    
    const deleteProduct = async () => {
      const { data } = await axios.delete(`https://localhost:7262/Products/${deleteId}`);
    }

    const handleErrors = (e) => {
        const { id, value } = e.target;
    
        if(value.length != 0) setIdError("");
    
        if(id === "id") {
            if(!/^\d+$/.test(value)) 
                setIdError("ID only contains numbers!");
            else if(value.length === 0)
                setIdError("ID can't be empty!");
            else setIdError("");
        }
        else if(id === "price") {
            if(!/^\d+\.?\d{1,2}$/.test(value))
                setPriceError("Invalid Price format!");
            else if(value.length === 0)
                setIdError("Price can't be empty!");
            else setPriceError("");
        }
    }

    const handleFileUpload = async () => {
      if(productImage === null || productImage === undefined || productImage.size === undefined || productImage.size <= 0 || productImage.size > 5120000) return false;
      else {
        await axios.post(`https://localhost:7262/Products/image/${action === "POST" ? postData.id : editData.id}`, {image: productImage}, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return true;
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(action === "DELETE" && deleteId !== null && deleteId > 0) {
          deleteProduct();
        }
        else if(idError !== "" || priceError !== "") 
            return;
        else if(action === "POST") {
          if(await handleFileUpload())
            await postProduct();
          else return;
        }
        else if(action === "EDIT") {
          await handleFileUpload();

          await editProduct();
        }
        setTimeout(() => setActionDone(true), 300);
        setTimeout(() => {
          closeModal();
          setActionDone(false);
          // navigate(0);
        }, 1000);
    }


    return (
        <div className={`fixed inset-0 flex items-center justify-center ${modalVisible ? 'opacity-100 z-50': 'opacity-0 -z-99'} transition-opacity duration-200 ease-in`}>
          <div className="bg-white p-8 rounded-md z-50 w-100 md:w-80">
            <div className="relative items-center gap-6">
              <h2 className="relative text-3xl md:text-2xl mb-8 font-bold text-slate-800">
                {!actionDone ? `${action[0] + action.slice(1).toLowerCase()} Your Product` : `Your product was ${action !== "DELETE" ? action[0]+action.slice(1).toLowerCase()+"ed" : action[0]+action.slice(1).toLowerCase()+"d"}`}
              </h2>
              {actionDone && <FontAwesomeIcon className="w-7 h-7 m-auto text-green-500 animate-ping-once"  icon={faCircleCheck} />}
              <button
                className="absolute -top-6 -right-4 text-4xl"
                onClick={() => {
                    setEditData({
                        id: "",
                        name: "",
                        category: "",
                        price: "",
                        image: ""
                      });
                    closeModal();
                }}
              >
                &times;
              </button>
            </div>

            {!actionDone && <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {action !== "DELETE" && <>
              <div className="relative flex items-center justify-between ">
                <label
                  htmlFor="id"
                  className="text-lg font-bold text-slate-600"
                >
                  ID
                </label>
                <input
                  type="text"
                  className="w-60 md:w-40 appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500 focus:shadow-outline bg-blue-50 border  border-slate-200"
                  id="id"
                  placeholder="Product ID..."
                  defaultValue={action === "EDIT" ? editData.id : ""}
                  readOnly={action === "EDIT" ? true : false}
                  onChange={(e) => {
                    handleErrors(e);
                    if(action === "POST") setPostData({...postData, id: e.target.value});
                    else if(action === "EDIT") setEditData({...editData, id: e.target.value});
                  }}
                  required />
                  <div className="h-1 absolute bottom-0 left-25 text-red-500 font-medium text-md">{idError}</div>
              </div>
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
                  defaultValue={action === "EDIT" ? editData.name : ""}
                  onChange={e => {
                    handleErrors(e);
                    if(action === "POST") setPostData({...postData, name: e.target.value});
                    else if(action === "EDIT") setEditData({...editData, name: e.target.value});
                  }}
                  required 
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="category"
                  className="text-lg font-bold text-slate-600"
                >
                  Category
                </label>
                <input
                  type="text"
                  className="w-60 md:w-40 appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500 focus:shadow-outline bg-blue-50 border  border-slate-200"
                  id="category"
                  placeholder="Product Category..."
                  defaultValue={editData.category}
                  onChange={e => {
                    handleErrors(e);
                    if(action === "POST") setPostData({...postData, category: e.target.value});
                    else if(action === "EDIT") setEditData({...editData, category: e.target.value});
                  }}
                  required 
                />
              </div>
              <div className="relative flex items-center justify-between">
                <label
                  htmlFor="price"
                  className="text-lg font-bold text-slate-600"
                >
                  Price
                </label>
                <input
                  type="text"
                  className="w-60 md:w-40 appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500 focus:shadow-outline bg-blue-50 border  border-slate-200"
                  id="price"
                  placeholder="Product Price..."
                  defaultValue={editData.price}
                  onChange={e => {
                    handleErrors(e);
                    if(action === "POST") setPostData({...postData, price: e.target.value});
                    else if(action === "EDIT") setEditData({...editData, price: e.target.value});
                  }}
                  required 
                />
                <div className="h-1 absolute bottom-0 left-25 text-red-500 font-medium text-md">{priceError}</div>
              </div>
              <div className="flex items-center justify-between">
                <label className=" text-lg font-bold text-slate-600">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  className="w-60 md:w-40 appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:border-blue-500 focus:shadow-outline bg-blue-50 border  border-slate-200"
                  onChange={e => {
                    setProductImage(e.target.files[0]);
                  }}
                />
              </div>
              </>}
              {action === "DELETE" && 
                <h1 className="text-xl font-medium text-center">Are you sure you want to delete product "{deleteId}" ?</h1>
              }

              <button className={`w-35 md:w-25 h-10 flex items-center justify-center gap-2 rounded-md font-medium ${action !== "DELETE" ? "bg-blue-600 hover:bg-blue-500" : "bg-red-600 hover:bg-red-500"} duration-150 ease-linear text-white ml-25`} type="submit">
                <FontAwesomeIcon icon={action === "POST" ? faPlus : action === "EDIT" ? faPenToSquare : faTrash} /> {action}{" "}
              </button>
            </form>}
          </div>
          <div className="overlay fixed inset-0 bg-black opacity-50"></div>
        </div>
    );
}

export default Modal;