import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faEnvelope,
  faHome,
  faPhone,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "../components/SuccessModal";

const AccountSettings = ({ user, token }) => {
  const [data, setData] = useState(user);
  const [profile, setProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(false);
  const [action, setAction] = useState("post");
  const [modal, setModal] = useState(false);
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "fullName") {
      if (value === "" || value.length === 0)
        setNameError("Name can't be empty!");
      else if (/^[A-Za-z\s]*$/.test(value)) setNameError("");
      else setNameError("Wrong Format!");
    } else setNameError("");

    setData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfile(URL.createObjectURL(e.target.files[0]));
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError !== "") return;
    await axios.patch(`https://localhost:7262/Clients`, {
      id: user.id,
      fullName: data.fullName,
      phone: data.phone === undefined ? "" : data.phone,
      address: data.address,
    });
    console.log(profile);
    if (profile) {
      if (action === "post") {
        await axios.post(
          `https://localhost:7262/Clients/image/${user.id}`,
          { image: profileImage },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    } else {
      await axios.delete(`https://localhost:7262/Clients/image/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    setModal(true);
    setTimeout(() => {
      setModal(false);
      navigate(0);
    }, 1000);
  };

  return (
    <form
      className="container flex justify-between items-start gap-8 md:flex-col"
      encType="multipart/form-data"
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* Personal Information */}
      <div className="w-7/12 md:w-full flex flex-col gap-3 bg-white relative  shadow-2 rounded">
        <h2 className="text-xl font-semibold mb-4 px-6 pt-6 text-black">
          Personal Information
        </h2>
        <hr className="w-full text-slate-300 " />
        <div className="flex justify-between gap-6 py-4 px-6">
          <div className="w-full relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
              <FontAwesomeIcon
                icon={faUser}
                className="w-5 h-5 text-slate-400"
              />
              <input
                className="w-full bg-inherit focus:outline-none focus:shadow-outline "
                id="fullName"
                type="text"
                placeholder="Full Name"
                defaultValue={user.fullName}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="absolute top-20 text-red-500 font-bold z-10">
              {nameError}
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
              <FontAwesomeIcon
                icon={faPhone}
                className="w-5 h-5 text-slate-400"
              />
              <input
                className="w-full bg-inherit focus:outline-none focus:shadow-outline "
                id="phone"
                type="text"
                placeholder="Phone"
                defaultValue={user.phone}
                onChange={(e) => handleChange(e)}
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
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-5 h-5 text-slate-400"
            />
            <input
              className="w-full bg-inherit focus:outline-none focus:shadow-outline "
              id="email"
              type="email"
              placeholder="Email Address"
              value={user.email}
              readOnly
            />
          </div>
        </div>
        <div className="py-4 px-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2 text-slate-600"
            htmlFor="address"
          >
            Address
          </label>
          <div className="flex items-center gap-4 sm:gap-2 rounded w-full p-4 text-gray-700 leading-tight bg-blue-50 border  border-slate-200">
            <FontAwesomeIcon icon={faHome} className="w-5 h-5 text-slate-400" />
            <input
              className="w-full bg-inherit focus:outline-none focus:shadow-outline "
              id="address"
              type="text"
              placeholder="Address"
              defaultValue={user.address}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 sm:gap-2 py-4 px-6">
          <button className="w-30 p-3 rounded-md font-medium outline outline-1 outline-blue-500 text-blue-500 hover:text-blue-700 hover:outline-blue-700 duration-150 ease-linear">
            Cancel
          </button>
          <button className="w-30 p-3 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white">
            Save
          </button>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="w-5/12 md:w-full lg:order-2 relative flex flex-col gap-0.5 bg-white shadow-2 rounded">
        <h2 className="text-xl font-semibold mb-7 px-6 pt-6 text-black">
          Your Photo
        </h2>
        <hr className="w-full text-slate-300 " />
        <div className="flex items-center gap-4 mb-4 p-4">
          <div className="rounded-full border-2 w-24 h-24 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={
                !profile
                  ? `https://localhost:7262/Clients/image/${user.id}`
                  : profile
              }
              alt="Profile"
            />
          </div>
          <div>
            <p className="text-slate-600 font-bold">Edit your Photo</p>
            <div className="flex gap-2 mt-2">
              <button
                className="text-slate-400 text-sm font-medium  hover:text-blue-500"
                onClick={() => {
                  setAction("delete");
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="border-dashed border-2 border-gray-300 rounded p-10 mx-8 text-center mb-4 bg-blue-50">
          <input
            type="file"
            name="profile"
            id="profile"
            accept="image/png, image/jpg, image/jpeg"
            className="absolute opacity-0 cursor-pointer w-13 h-13 p-4 rounded-full"
            onChange={(e) => handleImageChange(e)}
          />
          <FontAwesomeIcon
            icon={faUpload}
            className="w-5 h-5 cursor-pointer text-gray-500 mb-2 text-blue-500 bg-white rounded-full p-4"
          />
          <br />
          <span className="text-blue-500">Click to upload</span>
          <br />
          <span className="text-sm">PNG, JPG, JPEG</span>
          <br />
          <span className="text-sm">max (5 MB)</span>
        </div>
        <div className="flex justify-end p-4 gap-4">
          <button
            className="w-30 p-3 rounded-md  font-medium outline outline-1 outline-blue-500 text-blue-500 hover:text-blue-700 hover:outline-blue-700 duration-150 ease-linear"
            onClick={() => setProfile(false)}
          >
            Cancel
          </button>
          <button
            className="w-30 p-3 rounded-md font-medium bg-blue-600 hover:bg-blue-500 duration-150 ease-linear text-white"
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
      <SuccessModal modalVisible={modal} />
    </form>
  );
};

export default AccountSettings;
