import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faEye, faShoppingBag, faShoppingCart, faUsers } from '@fortawesome/free-solid-svg-icons';

const CardItems = () => {
    return (
        <div className="w-full flex tb:flex-wrap justify-between p-6 gap-4">
            {/* First Card */}
            <div className="bg-white p-6 rounded-lg border-[1px] border-gray flex flex-col justify-between w-full h-40">
                <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold">$3.456K</h4>
                        <p className="text-slate-500 font-medium">Total Views</p>
                    </div>
                    <p className="text-green-500 text-sm font-medium">0.43% <FontAwesomeIcon icon={faArrowUp}/></p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-[1px] border-gray flex flex-col justify-between w-full h-40">
                <FontAwesomeIcon icon={faShoppingCart} className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold">$45.2K</h4>
                        <p className="text-slate-500 font-medium">Total Profit</p>
                    </div>
                    <p className="text-green-500 text-sm font-medium">4.35% <FontAwesomeIcon icon={faArrowUp}/></p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-[1px] border-gray flex flex-col justify-between w-full h-40">
                <FontAwesomeIcon icon={faShoppingBag} className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold">2,450</h4>
                        <p className="text-slate-500 font-medium">Total Product</p>
                    </div>
                    <p className="text-green-500 text-sm font-medium">2.59% <FontAwesomeIcon icon={faArrowUp}/></p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-[1px] border-gray flex flex-col justify-between w-full h-40">
                <FontAwesomeIcon icon={faUsers} className="w-6 h-6 text-gray-600 text-blue-500 rounded-full bg-gray p-2" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-semibold">3,456</h4>
                        <p className="text-slate-500 font-medium">Total Users</p>
                    </div>
                    <p className="text-blue-500 text-sm font-medium">0.95% <FontAwesomeIcon icon={faArrowDown}/></p>
                </div>
            </div>
        </div>
    );
}

export default CardItems;