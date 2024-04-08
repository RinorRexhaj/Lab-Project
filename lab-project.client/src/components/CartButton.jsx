import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const CartButton = () => {

    return (
        <button className="hidden w-13 h-13 tb:fixed tb:flex justify-center items-center bottom-30 right-40 tb:right-30 md:right-20 sm:right-10 bg-black rounded-md text-slate-100">
            <FontAwesomeIcon icon={faShoppingCart} className="text-2xl"/>
            <div className="w-6 h-6 absolute -top-3 -right-3 rounded-full border-2 border-blue-950 bg-white text-blue-900 font-semibold font-2xl flex justify-center items-center">
                3
            </div>
        </button>
    )
}

export default CartButton