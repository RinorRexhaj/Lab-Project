import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  faAngleDown,
  faPaperPlane,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Message from "../components/Message";
import { HubConnectionBuilder } from "@microsoft/signalr";

const Chat = ({ token, chat, setChat, userId }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([[]]);
  const [filteredMessages, setFilteredMessages] = useState([[]]);
  const [lastMessage, setLastMessage] = useState([]);
  const [openChat, setOpenChat] = useState({});
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState({
    senderId: userId,
    receiverId: openChat.id,
    messageText: "",
    created: true,
  });
  const [connection, setConnection] = useState();
  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const getMessages = async () => {
    await axios
      .get(`https://localhost:7262/Messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setMessages(resp.data.reverse());
      });
  };

  const getUsers = async () => {
    await axios
      .get(`https://localhost:7262/Messages/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        const data = resp.data.sort((a, b) => b.maxMessage - a.maxMessage);
        setUsers(data);
      });
  };

  const filterMessages = (user) => {
    return messages.filter(
      (message) =>
        (message.senderId === userId && message.receiverId === user.id) ||
        (message.senderId === user.id && message.receiverId === userId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message === null || message === undefined || message.messageText === "")
      return;
    setMessage({ ...message, messageText: "" });
    const response = await axios
      .post(
        `https://localhost:7262/Messages`,
        {
          ...message,
          id: 0,
          sent: new Date(Date.now() + 120 * 60 * 1000),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((resp) => {
        setMessages([{ ...resp.data }, ...messages]);
        connection
          .invoke(
            "SendMessage",
            resp.data.id.toString(),
            resp.data.senderId.toString(),
            resp.data.receiverId.toString(),
            resp.data.messageText,
            resp.data.sent.toString()
          )
          .catch((err) => {
            console.log(err);
          });
        setFilteredMessages([
          { ...resp.data, created: true },
          ...filteredMessages,
        ]);
        // setLastMessage([{ ...resp.data }, ...lastMessage]);
      });
  };

  // const getLastMessages = () => {
  //   const maxMsg = users.map(({ maxMessage }) => maxMessage);
  //   setLastMessage(messages.filter(({ id }) => maxMsg.includes(id)));
  // };

  const startConnection = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7262/chatHub", { withCredentials: false })
      .build();
    await connection
      .start()
      .then(() => {
        connection.invoke("Connect", userId.toString());
      })
      .catch((err) => console.log(err));
    connection.on(
      "ReceiveMessage",
      (id, senderId, receiverId, message, sent) => {
        const msg = {
          id: parseInt(id),
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          messageText: message,
          sent: sent,
          created: true,
        };
        setUsers(
          users.map((user) => {
            if (msg.senderId == user.id || msg.receiverId == user.id)
              return { ...user, maxMessage: msg };
            else return user;
          })
        );
        getMessages();
        setFilteredMessages([msg, ...filteredMessages]);
        // const newLast = lastMessage.map((lm) => {
        //   if (lm.id == msg.id) return;
        //   if (
        //     (msg.senderId == lm.senderId && msg.receiverId == lm.receiverId) ||
        //     (msg.receiverId == lm.senderId && msg.senderId == lm.receiverId)
        //   ) {
        //     if (lastMessage.length < users.length) return;
        //     return {
        //       ...msg,
        //       sent: new Date(Date.now()).toISOString(),
        //       // sent: sent,
        //       created: true,
        //     };
        //   } else return lm;
        // });
        // setLastMessage(newLast);
      }
    );
    setConnection(connection);
  };

  useEffect(() => {
    const mount = async () => {
      // await getUsers();
      await startConnection();
    };
    mount();
  }, [filteredMessages, lastMessage]);

  useEffect(() => {
    const mount = async () => {
      await getUsers();
      await getMessages();
      // getLastMessages();
      await startConnection();
    };
    mount();
    setOpenChat({});
  }, [chat]);

  return (
    <div
      className={`min-w-90 h-100 md:w-50 flex flex-col items-start bg-white absolute bottom-0 right-10 shadow-4 p-4 gap-3 duration-200 ease-linear ${
        chat ? "opacity-100 z-9" : "opacity-0 -z-9"
      }`}
    >
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold">
          {openChat.id === undefined ? "Chats" : openChat.fullName}
        </h1>
        <div className="flex gap-3">
          {openChat.id !== undefined && (
            <FontAwesomeIcon
              icon={faAngleDown}
              className="cursor-pointer"
              onClick={() => setOpenChat({})}
            />
          )}
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer"
            onClick={() => setChat(false)}
          />
        </div>
      </div>
      <span className="w-full h-[1px] bg-slate-200"></span>
      <div className="w-full flex flex-col">
        {openChat.id === undefined ? (
          users.map((user) => {
            return (
              <div
                className="relative w-full min-h-15 flex py-2 hover:bg-slate-100 duration-150 ease-linear cursor-pointer"
                onClick={() => {
                  setOpenChat(user);
                  setMessage({ ...message, receiverId: user.id });
                  setFilteredMessages(filterMessages(user));
                }}
                key={user.id}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-4 h-4 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-3 rounded-full cursor-pointer"
                />
                <div className="w-full relative flex flex-col items-start left-3">
                  <p>{user.fullName}</p>
                  <div className="w-full flex items-center justify-between">
                    <p className={`text-sm text-slate-500 `}>
                      {user.maxMessage !== undefined &&
                      user.maxMessage.senderId === userId
                        ? "You: "
                        : ""}
                      {user.maxMessage !== undefined &&
                        user.maxMessage.messageText}
                    </p>
                    <p className="relative text-sm text-slate-500 right-10">
                      {user.maxMessage !== undefined &&
                        timeAgo.format(
                          new Date(user.maxMessage.sent),
                          "mini-now"
                        )}
                    </p>
                  </div>
                </div>
                <span className="w-full absolute bottom-0 z-10 h-[1px] bg-gray"></span>
              </div>
            );
          })
        ) : (
          <div className="relative w-full h-80 flex flex-col gap-2">
            <div
              className={`relative w-full h-70 flex flex-col-reverse gap-0.5 overflow-y-auto overflow-x-hidden`}
            >
              {filteredMessages.map((msg, index) => {
                return (
                  <Message
                    key={msg.id}
                    id={msg.id}
                    sender={msg.senderId}
                    receiver={msg.receiverId}
                    message={msg.messageText}
                    sent={msg.sent}
                    prevSent={
                      index < filteredMessages.length - 1 ||
                      filteredMessages[index + 1] !== undefined
                        ? filteredMessages[index + 1]
                        : false
                    }
                    created={msg.created}
                    userId={userId}
                    token={token}
                    hover={hover}
                    setHover={setHover}
                    messages={filteredMessages}
                    setMessages={setFilteredMessages}
                  />
                );
              })}
            </div>
            <form
              action=""
              className="w-full rounded-md flex items-center border-slate-300 border bg-white z-10 absolute bottom-0"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Send a message..."
                className="w-full px-3 py-1 rounded-md focus:outline-slate-400"
                value={message.messageText}
                onChange={(e) =>
                  setMessage({ ...message, messageText: e.target.value })
                }
              />
              <button type="submit">
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className="absolute right-2 top-1.5 text-blue-500 w-4 h-4"
                />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
