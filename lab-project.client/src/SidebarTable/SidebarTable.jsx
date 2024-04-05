import React from 'react';
import Tables from '../components/Tables'; // importi i Tables.jsx prej folderit "components"

const SidebarTable = () => {
    return (
        <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}> {/* background color si ne demo me  https://imagecolorpicker.com/en*/}
            <h1 className="w-full text-5xl font-semibold flex justify-center items-center">Ktu Search Bar</h1> {/* Ktu search bar qe e ka punu orgesi */}
            <div style={{ backgroundColor: 'white', padding: '20px' }}> 
                <Tables /> {/* importi i Tables.jsx prej folderit components */}
            </div>
        </div>
    ) 
}

export default SidebarTable;
