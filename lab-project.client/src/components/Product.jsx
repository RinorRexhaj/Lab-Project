import ProductImage from "./ProductImage"

const Product = ({img, name, category, price }) => {
    return (
        <div className="relative w-9/12 py-6 px-8  sm:px-6 flex items-center justify-between gap-4">
          <div className="w-1/4 md:w-3/5 text-black font-medium text-sm flex items-center gap-5 sm:gap-2">
            <ProductImage src={img} alt={name}/>
            <p>{name}</p>
          </div>
          <div className="w-2/12 md:hidden text-black  text-sm font-medium">{category}</div>
          <div className="w-2/12 text-black text-sm font-medium">${price}</div>
          <span className="w-full absolute bottom-0 h-[1px] bg-slate-200"></span>
       </div>
    )
}

export default Product