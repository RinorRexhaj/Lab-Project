import { useState } from 'react';
import Product from './Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const Tables = () => {
  let products = [
  {
    img: 'src/components/images/product-01.png',
    name: 'Apple watch Series 7',
    category: 'Electronics',
    price: '269'
  },
  {
    img: 'src/components/images/product-03.png',
    name: 'Dell Inspiron 15',
    category: 'Electronics',
    price: '643'
  },
  {
    img: 'src/components/images/product-02.png',
    name: 'Macbook Pro M1',
    category: 'Electronics',
    price: '546'
  },
  {
    img: 'src/components/images/product-04.png',
    name: 'HP Probook 450',
    category: 'Electronics',
    price: '499'
  },
  ];

  const [sort, setSort] = useState("name-asc");

  switch(sort) {
    case "name-asc":
      products = products.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "name-desc":
      products = products.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "category-asc":
      products = products.sort((a, b) => a.category.localeCompare(b.category))
      break
    case "category-desc":
      products = products.sort((a, b) => b.category.localeCompare(a.category))
      break
    case "price-asc":
      products = products.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      products = products.sort((a, b) => b.price - a.price)
      break
  }

  return (
    <div className="w-full shadow-2 bg-white flex flex-col">
       <div className="w-full py-6 px-8">
        <h1 className="text-xl font-semibold">Top Products</h1>
       </div>
       <span className="w-full h-[1px] bg-slate-200"></span>
       <div className="w-9/12 py-6 px-8 sm:px-6 flex items-center justify-between gap-4s">
        <p className={`w-1/4 md:w-3/5 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("name") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "name-asc" ? "name-desc" : "name-asc"
          setSort(sortType)
          
      }}>Product Name <FontAwesomeIcon icon={sort == 'name-asc' ? faAngleUp : faAngleDown} /></p>
        <p className={`w-2/12 md:hidden text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("category") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "category-asc" ? "category-desc" : "category-asc"
          setSort(sortType)         
        }
        }>Category <FontAwesomeIcon icon={sort == 'category-asc' ? faAngleUp : faAngleDown} /></p>
        <p className={`w-2/12 text-slate-500 font-medium cursor-pointer select-none hover:text-slate-700 duration-150 ease-linear ${sort.includes("price") ? "text-slate-900 font-semibold" : ""}`} onClick={() => {
          let sortType = sort == "price-asc" ? "price-desc" : "price-asc"
          setSort(sortType)
        }}>Price <FontAwesomeIcon icon={sort == 'price-asc' ? faAngleUp : faAngleDown} /></p>
      </div>
       <span className="w-full h-[1px] bg-slate-200"></span>
       {products.map(product => {
        return <Product key={product.name} img={product.img} name={product.name} category={product.category} price={product.price} />
       })}
    </div>
  );
}

export default Tables;