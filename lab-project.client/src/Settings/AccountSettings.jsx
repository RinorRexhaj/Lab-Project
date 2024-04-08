import { React, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faUpload, faUser } from "@fortawesome/free-solid-svg-icons";

const AccountSettings = () => {
  return (
    <div className="container flex justify-between items-start gap-8 md:flex-col">
      {/* Personal Information */}
      <div className="w-7/12 md:w-full bg-white relative flex-col shadow-2 rounded">
        <h2 className="text-xl font-semibold mb-4 p-6 text-black">
          Personal Information
        </h2>
        <hr className="absolute w-full -mt-5 text-slate-300 " />
        <div className="flex justify-between gap-6 py-4 px-6">
          <div className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-slate-400"/>
            <input
              className="w-full bg-inherit focus:outline-none focus:shadow-outline "
              id="fullName"
              type="text"
              placeholder="Full Name"
            />
          </div>
          </div>
          <div className="w-full">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
              <FontAwesomeIcon icon={faPhone} className="w-5 h-5 text-slate-400"/>
              <input
                className="w-full bg-inherit focus:outline-none focus:shadow-outline "
                id="phone"
                type="text"
                placeholder="Phone"
              />
          </div>
          </div>
        </div>
        <div className="py-4 px-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
            <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-slate-400"/>
            <input
              className="w-full bg-inherit focus:outline-none focus:shadow-outline "
              id="email"
              type="email"
              placeholder="Email Address"
            />
          </div>
        </div>
        <div className="py-4 px-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
            htmlFor="username"
          >
            Username
          </label>
          <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-slate-400"/>
            <input
              className="w-full bg-inherit focus:outline-none focus:shadow-outline "
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
        </div>
        <div className="py-4 px-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
            htmlFor="bio"
          >
            BIO
          </label>
          <textarea
            className="appearance-none  rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-blue-50 border  border-slate-200"
            id="bio"
            placeholder="Your bio"
            rows="4"
          ></textarea>
        </div>
        <div className="flex justify-end gap-4 sm:gap-2 py-4 px-6">
          <button className="w-30 p-3 rounded-md font-medium outline outline-1 outline-blue-500 text-blue-500 hover:text-blue-700 hover:outline-blue-700 duration-150 ease-linear">Cancel</button>
          <button className="w-30 p-3 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white">Save</button>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="w-5/12 md:w-full lg:order-2 relative flex-col bg-white shadow-2 rounded">
        <h2 className="text-xl font-semibold mb-6 p-6 text-black">
          Your Photo
        </h2>
        <hr className="absolute w-full -mt-5 text-slate-300 " />
        <div className="flex items-center gap-4 mb-4 p-4">
          <div className="rounded-full w-24 h-24 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="/src/components/images/user-03.png" alt="Profile" />
          </div>
          <div>
            <p className="text-slate-600 font-bold">Edit your Photo</p>
            <div className="flex gap-2 mt-2">
              <button
                className="text-slate-400 text-sm font-medium  hover:text-blue-500"
                onClick={() => console.log("Delete photo")}
              >
                Delete
              </button>
              <button
                className="text-slate-400 text-sm font-medium hover:text-blue-500"
                onClick={() => console.log("Edit photo")}
              >
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="border-dashed border-2 border-gray-300 rounded p-10 mx-8 text-center mb-4 bg-blue-50">
          <FontAwesomeIcon
            icon={faUpload}
            className="text-gray-500 mb-2 text-blue-500 bg-white rounded-full p-4"
          />
          <br />
          <span className="text-blue-500">Click to upload</span> or drag and
          drop
          <br />
          SVG, PNG, JPG, JPEG
          <br />
          (max 800 X 800px)
        </div>
        <div className="flex justify-end p-4 gap-4">
        <button className="w-30 p-3 rounded-md font-medium outline outline-1 outline-blue-500 text-blue-500 hover:text-blue-700 hover:outline-blue-700 duration-150 ease-linear">Cancel</button>
          <button className="w-30 p-3 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;