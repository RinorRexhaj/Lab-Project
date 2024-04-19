import { useState, useEffect } from 'react';
import Product from './Product';
import Modal from './Modal';
import Loader from './Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faPlus } from '@fortawesome/free-solid-svg-icons';

const Tables = ({products, productsFilter, loading}) => {
  const [sort, setSort] = useState("id");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("POST");
  const [postData, setPostData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: ""
  });
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: ""
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

  let prd = productsFilter.length === 0 ? products : productsFilter;
  switch(sort) {
    case "id": 
      prd = prd.sort((a, b) => a.id - b.id);
      break
    case "name-asc":
      prd = prd.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name-desc":
      prd = prd.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "category-asc":
      prd = prd.sort((a, b) => a.category.localeCompare(b.category))
      break
    case "category-desc":
      prd = prd.sort((a, b) => b.category.localeCompare(a.category))
      break
    case "price-asc":
      prd = prd.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      prd = prd.sort((a, b) => b.price - a.price)
      break
  }

  return (
    <div className="w-full min-h-125 shadow-2 bg-white flex flex-col">
       <div className="w-full flex items-center justify-between bg-white py-4 px-8 sm:px-4">
        <h1 className="text-xl font-semibold">Top Products</h1>
        <button className="w-35 md:w-25 h-10 flex items-center justify-center gap-2 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white" onClick={() => {
          openModal();
          setEditData({
            id: "",
            name: "",
            category: "",
            price: "",
            image: ""
          });
          setModalAction("POST");
        }}><FontAwesomeIcon icon={faPlus}/> Add <p className="md:hidden">Product</p></button>
       </div>
       <span className="w-full h-[1px] bg-slate-200"></span>
       <div className="w-full py-6 px-8 sm:px-4 flex items-center justify-between bg-white gap-4">
        <p className={`w-1/3 md:w-3/5 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("name") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "name-asc" ? "name-desc" : "name-asc"
          setSort(sortType)     
        }}>Product Name <FontAwesomeIcon icon={sort == 'name-asc' ? faAngleUp : faAngleDown} /></p>
        <p className={`w-1/4 md:hidden text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("category") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "category-asc" ? "category-desc" : "category-asc"
          setSort(sortType)         
        }
        }>Category <FontAwesomeIcon icon={sort == 'category-asc' ? faAngleUp : faAngleDown} /></p>
        <p className={`w-1/6 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("price") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "price-asc" ? "price-desc" : "price-asc"
          setSort(sortType)
        }}>Price <FontAwesomeIcon icon={sort == 'price-asc' ? faAngleUp : faAngleDown} /></p>
        <p className={`w-1/4 text-slate-500 md:hidden font-medium select-none`}>Actions</p>
      </div>
       <span className="w-full h-[1px] bg-slate-200"></span>
        {loading ?      
        <Loader />
        : prd.map(product => {
        return <Product key={product.id} id={product.id} image={product.image} name={product.name} category={product.category} price={product.price} openModal={openModal} setModalAction={setModalAction} setEditData={setEditData} setDeleteId={setDeleteId} />
       })}
       <Modal action={modalAction} closeModal={closeModal} modalVisible={modalVisible} postData={postData} setPostData={setPostData} editData={editData} setEditData={setEditData} deleteId={deleteId}/>
    </div>
  );
}

export default Tables;