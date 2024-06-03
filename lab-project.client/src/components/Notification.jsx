import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const Notification = ({
  id,
  created,
  sender,
  message,
  setChat,
  notifications,
  setNotifications,
}) => {
  useEffect(() => {
    setTimeout(() => {
      let newNotifs = notifications;
      newNotifs = newNotifs.filter((n) => n.id !== id);
      setNotifications(newNotifs);
    }, 4950);
  }, []);

  return (
    <div
      className={`relative w-80 h-15 z-99 bg-white flex items-center justify-between px-4 border border-slate-200 shadow-2 ${
        created ? "animate-fade" : "hidden"
      }`}
    >
      <p
        className="w-full text-md cursor-pointer"
        onClick={() => setChat(true)}
      >
        <b>{sender}:</b>{" "}
        {message.length <= 20 ? message : message.substring(0, 20) + "..."}
      </p>
      <div
        className="z-10 w-5 h-5 bg-slate-400 rounded-full flex items-center justify-center p-1 cursor-pointer"
        onClick={() => {
          setNotifications(notifications.filter((n) => n.id !== id));
        }}
      >
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div
        className={`absolute bottom-0 right-0 w-80 bg-blue-400 h-1.5 rounded-lg animate-sliding`}
      ></div>
    </div>
  );
};

export default Notification;
