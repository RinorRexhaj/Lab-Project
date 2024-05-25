import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";

const Message = ({
  id,
  sender,
  receiver,
  message,
  sent,
  prevSent,
  created,
  userId,
  token,
  hover,
  setHover,
  messages,
  setMessages,
}) => {
  const diff =
    Math.abs(new Date(sent) - new Date(prevSent.sent)) / 1000 / 60 > 1;
  const dateDiff =
    prevSent !== false &&
    prevSent.sent !== undefined &&
    sent.substring(0, 10) === prevSent.sent.substring(0, 10);
  const consequent = sender === prevSent.senderId;
  const months = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [editedMessage, setEditedMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    editMessage();
    setHover(0);
  };

  const editMessage = async () => {
    const response = await axios
      .patch(
        "https://localhost:7262/Messages",
        {
          id: id,
          messageText: editedMessage,
          senderId: sender,
          receiverId: receiver,
          sent: sent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setMessages(
          messages.map((m) => {
            if (m.id === id)
              return { ...m, messageText: resp.data.messageText };
            else return m;
          })
        );
      });
    setEdit(false);
  };

  const deleteMessage = async () => {
    const response = await axios
      .delete(`https://localhost:7262/Messages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setMessages(messages.filter((m) => m.id !== id));
      });
    setDel(false);
  };

  return (
    <div
      className={`relative w-50 ${
        sender === userId
          ? "bg-slate-300 text-slate-800 -right-27 "
          : "bg-blue-500 text-white left-0"
      }  font-medium rounded-md p-2 ${created === true && "animate-fade"} ${
        !consequent ? (diff ? "mt-5" : "mt-2") : !diff ? "" : "mt-5"
      } ${!dateDiff && "mt-16"}`}
      onMouseEnter={() => setHover(id)}
      onMouseLeave={() => {
        setHover(0);
        setEdit(false);
        setDel(false);
        setEditedMessage("");
      }}
    >
      {hover === id && edit ? (
        <form action="" onSubmit={handleSubmit}>
          <input
            type="text"
            className="bg-inherit"
            defaultValue={message}
            autoFocus={edit}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        </form>
      ) : (
        message
      )}
      {sender === userId && hover === id && (
        <div
          className={`absolute -left-16 top-2.5 w-10 h-5 flex items-center gap-2`}
        >
          <button
            className="w-7 h-7 p-2 flex items-center justify-center rounded-full bg-blue-400 text-slate-50 hover:bg-blue-500 ease-linear duration-150 animate-fade"
            onClick={() => {
              setDel(false);
              setEdit(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button
            className="w-7 h-7 p-2 flex items-center justify-center rounded-full bg-red-400 text-slate-50 hover:bg-red-500 ease-linear duration-150 animate-fade"
            onClick={() => {
              setEdit(false);
              setDel(true);
              deleteMessage();
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
      <p
        className={`absolute -top-4 ${
          sender === userId ? "right" : "left"
        }-0 text-xs text-slate-500`}
      >
        {diff && sent.substring(11, 16)}
      </p>
      {!dateDiff && (
        <div
          className={`absolute flex justify-between items-center gap-4 -top-10 ${
            sender === userId ? "-left-30" : "-left-3"
          } h-[1px] w-80`}
        >
          <span className="relative h-[1px] w-full bg-slate-300"></span>
          <p className="w-full flex justify-center text-slate-400 text-sm font-thin">
            {sent !== undefined &&
              sent.substring(8, 10) +
                " " +
                months[Math.abs(sent.substring(5, 7))] +
                " " +
                sent.substring(0, 4)}
          </p>
          <span className="relative h-[1px] w-full bg-slate-300"></span>
        </div>
      )}
    </div>
  );
};

export default Message;
