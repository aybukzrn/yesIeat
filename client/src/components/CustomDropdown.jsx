import React, { useState } from 'react';
import './CustomDropdown.css'; 
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdArrowDropUp } from 'react-icons/md';

const CustomDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleClasses = `dropdown-toggle ${isOpen ? 'active' : ''}`;

  return (
    <div className="custom-dropdown">
        
      <button className={toggleClasses} onClick={() => setIsOpen(!isOpen)}>
        {title}
         {isOpen ?  <MdArrowDropUp />:<IoMdArrowDropdown /> } 
      </button>

      
      {isOpen && (
        <div className="dropdown-menu">
          {children} 
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;

