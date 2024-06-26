import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const SuccessModal = ({ modalVisible }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        modalVisible ? "opacity-100 z-50" : "opacity-0 -z-99"
      } transition-opacity duration-200 ease-in`}
    >
      <div className="bg-white p-8 rounded-md z-50 w-100 md:w-80">
        <div className="relative items-center gap-6">
          <h2 className="relative text-3xl md:text-2xl mb-8 font-bold text-slate-800">
            Profile Changes Saved Successfully!
          </h2>
          <FontAwesomeIcon
            className="w-7 h-7 m-auto text-green-500 animate-ping-once"
            icon={faCircleCheck}
          />
        </div>
      </div>
      <div className="overlay fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default SuccessModal;
