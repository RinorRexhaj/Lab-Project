import React, { useEffect, useState } from "react";
import {
  faAngleDown,
  faPaperPlane,
  faXmark,
  faUser,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import axios from "axios";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Message from "./Message";
import Notification from "../components/Notification";
import User from "./User";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const Chat = ({
  token,
  chat,
  setChat,
  userId,
  messageCount,
  setMessageCount,
}) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [unSeenMessages, setUnSeenMessages] = useState([]);
  const [openChat, setOpenChat] = useState({});
  const [group, setGroup] = useState(undefined);
  const [hover, setHover] = useState(0);
  const [typing, setTyping] = useState([]);
  const [searching, setSearching] = useState(false);
  const [clients, setClients] = useState([]);
  const [searchClients, setSearchClients] = useState([]);
  const [message, setMessage] = useState({
    senderId: userId,
    receiverId: openChat.id,
    messageText: "",
    created: true,
  });
  const [connection, setConnection] = useState(false);
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
        const data = resp.data.sort((a, b) => b.lastMessage - a.lastMessage);
        let count = 0;
        resp.data.map((c, index) => {
          if (
            c.lastMessage.receiverId === userId &&
            c.lastMessage.seen === "0001-01-01T00:00:00" &&
            index < resp.data.length
          ) {
            count++;
          }
        });
        setUsers(data);
        setMessageCount(count);
      });
  };

  const filterMessages = (user) => {
    return messages.filter(
      (message) =>
        (message.senderId === userId && message.receiverId === user.id) ||
        (message.senderId === user.id && message.receiverId === userId)
    );
  };

  const searchUsers = (search) => {
    if (search.length !== 0 && search !== "") {
      setSearching(true);
      const filteredClients = clients
        .filter(
          (c) =>
            c.fullName.toLowerCase().includes(search.toLowerCase()) &&
            c.id !== userId
        )
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      const newClients = filteredClients.map((c) => {
        let client = users.find((u) => u.id === c.id);
        if (client !== undefined) return { ...client };
        return c;
      });
      setSearchClients(newClients);
    } else {
      setSearching(false);
      setSearchClients([]);
      getUsers();
    }
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
        connection.invoke("RemoveTyping", message.senderId, message.receiverId);
        connection
          .invoke(
            "SendMessage",
            resp.data.id,
            resp.data.senderId,
            resp.data.receiverId,
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
        connection.invoke("SameChat", message.senderId, message.receiverId);
        setSearching(false);
        setSearchClients([]);
      });
  };

  const startConnection = async () => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7262/chat", { withCredentials: false })
      .configureLogging(LogLevel.None)
      .build();
    await connection
      .start()
      .then(() => {
        connection.invoke("Connect", userId);
      })
      .catch((err) => console.log(err));
    connection.on(
      "ReceiveMessage",
      (id, senderId, receiverId, message, sent) => {
        const msg = {
          id: id,
          senderId: senderId,
          receiverId: receiverId,
          messageText: message,
          sent: sent,
          created: true,
        };
        getUsers();
        getMessages();
        if (openChat.id === senderId) {
          setFilteredMessages([
            { ...msg, seen: new Date(Date.now() + 120 * 60 * 1000) },
            ...filteredMessages,
          ]);
        }
        const userName = clients.find((u) => u.id === msg.senderId).fullName;
        if (userId === receiverId) {
          document.title = `(${messageCount}) ${userName} sent you a message.`;
          setTimeout(() => {
            document.title = "Lab Project";
          }, 5000);
        }
        if (!chat) {
          axios
            .get(`https://localhost:7262/Clients/image/${senderId}`)
            .then((resp) => {
              const notify = () => {
                toast(
                  <Notification
                    senderId={senderId}
                    userName={userName}
                    msg={msg.messageText}
                    profile={true}
                  />,
                  {
                    progressStyle: { background: "#3b82f6" },
                    type: "info",
                    icon: false,
                  }
                );
              };
              notify();
            })
            .catch((err) => {
              const notify = () => {
                toast(
                  <Notification
                    senderId={senderId}
                    userName={userName}
                    msg={msg.messageText}
                    profile={false}
                  />,
                  {
                    progressStyle: { background: "#3b82f6" },
                    type: "info",
                    icon: false,
                  }
                );
              };
              notify();
            });
        }
      }
    );
    connection.on("EditedMessage", (id, senderId, receiverId, message) => {
      if (userId === receiverId) {
        if (openChat.id === senderId)
          setFilteredMessages(
            filteredMessages.map((msg) => {
              if (msg.id === id) {
                return { ...msg, messageText: message, edited: true };
              } else return msg;
            })
          );
        else {
          getUsers();
          getMessages();
        }
      }
    });
    connection.on("DeletedMessage", (id, senderId, receiverId) => {
      if (userId === receiverId) {
        if (userId === receiverId) {
          if (openChat.id === senderId) {
            setFilteredMessages(
              filteredMessages.map((m) => {
                if (m.id === id) return { ...m, deleted: true };
                return m;
              })
            );
            setTimeout(() => {
              setFilteredMessages(
                filteredMessages.filter((msg) => msg.id !== id)
              );
            }, 300);
          } else {
            getUsers();
            getMessages();
          }
        }
      }
    });
    connection.on("ReceiveTyping", (senderId) => {
      setTyping([senderId, ...typing]);
    });
    connection.on("RmvTyping", (senderId) => {
      setTyping(typing.filter((t) => t !== senderId));
    });
    connection.on("ReceiveSeen", (senderId) => {
      getUsers();
      getMessages();
      const newMsg = filteredMessages.map((msg) => {
        if (
          msg.seen === "0001-01-01T00:00:00" ||
          msg.seen === undefined ||
          userId === senderId
        ) {
          return { ...msg, seen: new Date(Date.now()) };
        }
        return msg;
      });
      setFilteredMessages(newMsg);
    });
    connection.on("ReceiveSameChat", (senderId, receiverId) => {
      if (userId === openChat.id)
        connection.invoke("SendSeen", userId, openChat.id);
      connection.invoke(
        "ConfirmSameChat",
        senderId,
        openChat.id === undefined ? 0 : openChat.id
      );
    });
    connection.on("ReceiveConfirmSameChat", async (senderId, openChatId) => {
      if (senderId === openChatId) {
        let msg;
        await axios
          .get(`https://localhost:7262/Messages/last/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((resp) => {
            msg = resp.data;
          });
        msg = { ...msg, seen: new Date(Date.now() + 120 * 60 * 1000) };
        axios
          .patch("https://localhost:7262/Messages/lastseen", msg, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((resp) => {
            setFilteredMessages([
              { ...resp.data, seen: new Date(Date.now()) },
              ...filteredMessages,
            ]);
          });
      }
    });
    getUsers();
    setConnection(connection);
  };

  useEffect(() => {
    const mount = async () => {
      await startConnection();
    };
    mount();
  }, [filteredMessages]);

  useEffect(() => {
    const mount = async () => {
      await getUsers();
      await getMessages();
      await startConnection();
      await axios
        .get("https://localhost:7262/Clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((resp) => {
          setClients(resp.data);
        });
    };
    mount();
    if (connection.state === "Connected" && openChat.id !== undefined)
      connection.invoke("RemoveTyping", userId, openChat.id);
  }, [chat, openChat]);

  return (
    <div
      className={`min-w-90 h-100 md:w-50 flex flex-col items-start bg-white absolute bottom-0 right-10 shadow-xl p-4 gap-3 duration-200 ease-linear ${
        chat ? "opacity-100 z-9" : "opacity-0 -z-9"
      }`}
    >
      <div className="w-full flex gap-2 justify-between items-center">
        <h1 className={`relative font-bold flex gap-2 items-center`}>
          {openChat.id === undefined ? (
            group === undefined ? (
              "Chats"
            ) : (
              <form
                action=""
                className="relative w-22 rounded-md flex items-center bg-white z-10"
              >
                <input
                  type="text"
                  className="w-full rounded-md font-bold"
                  defaultValue={group.name}
                  onChange={(e) => {
                    setGroup({ ...group, name: e.target.value });
                  }}
                  autoFocus={group !== undefined}
                />
              </form>
            )
          ) : openChat.profile ? (
            <img
              className="w-6 h-6 rounded-full"
              src={`https://localhost:7262/Clients/image/${openChat.id}`}
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="w-2 h-2 text-slate-600 bg-slate-300 hover:bg-slate-400 ease-in duration-150 p-2 rounded-full cursor-pointer"
            />
          )}
          {openChat.active && (
            <div className="absolute bottom-0 left-4.5 h-2.5 w-2.5 rounded-full bg-green-400"></div>
          )}
          {openChat.fullName}
        </h1>
        <div className="flex gap-3">
          {openChat.id === undefined && (
            <form
              action=""
              className={`relative ${
                group === undefined ? "-left-18" : "-left-6"
              } w-50 rounded-md flex items-center bg-white z-10"`}
            >
              <input
                type="text"
                placeholder="Find a user..."
                className="w-full rounded-md focus:outline-none"
                onChange={(e) => {
                  searchUsers(e.target.value);
                }}
              />
            </form>
          )}
          {openChat.id !== undefined ? (
            <FontAwesomeIcon
              icon={faAngleDown}
              className="cursor-pointer absolute right-10"
              onClick={() => {
                connection.invoke("RemoveTyping", userId, openChat.id);
                setOpenChat({});
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={group !== undefined ? faMinus : faPlus}
              className="cursor-pointer z-10 absolute right-9"
              onClick={() => {
                setOpenChat({});
                setGroup(
                  group !== undefined ? undefined : { name: "New Group" }
                );
              }}
            />
          )}
          <FontAwesomeIcon
            icon={faXmark}
            className="cursor-pointer z-10 absolute right-4"
            onClick={() => {
              setOpenChat({});
              setGroup(undefined);
              setChat(false);
            }}
          />
        </div>
      </div>
      <span className="relative z-10 w-full h-[1px] bg-slate-200"></span>
      <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
        {openChat.id === undefined ? (
          messages.length > 0 || searching ? (
            searching ? (
              searchClients.length > 0 ? (
                searchClients.map((user) => {
                  return (
                    <User
                      key={user.id}
                      token={token}
                      user={user}
                      userId={userId}
                      active={user.active}
                      searching={searching}
                      setOpenChat={setOpenChat}
                      message={message}
                      setMessage={setMessage}
                      filterMessages={filterMessages}
                      setFilteredMessages={setFilteredMessages}
                      unSeenMessages={unSeenMessages}
                      setUnSeenMessages={setUnSeenMessages}
                      typing={typing}
                      timeAgo={timeAgo}
                      connection={connection}
                    />
                  );
                })
              ) : (
                <h1 className="relative m-auto -top-16 font-bold text-xl">
                  No results...
                </h1>
              )
            ) : (
              !searching &&
              users.map((user) => {
                return (
                  <User
                    key={user.id}
                    token={token}
                    user={user}
                    userId={userId}
                    active={user.active}
                    searching={searching}
                    setOpenChat={setOpenChat}
                    message={message}
                    setMessage={setMessage}
                    filterMessages={filterMessages}
                    setFilteredMessages={setFilteredMessages}
                    unSeenMessages={unSeenMessages}
                    setUnSeenMessages={setUnSeenMessages}
                    typing={typing}
                    timeAgo={timeAgo}
                    connection={connection}
                  />
                );
              })
            )
          ) : (
            <h1 className="relative m-auto top-20 font-bold text-xl">
              Start a conversation...
            </h1>
          )
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
                    edited={msg.edited}
                    deleted={msg.deleted}
                    seen={msg.seen}
                    last={index === 0}
                    userId={userId}
                    token={token}
                    hover={hover}
                    setHover={setHover}
                    messages={filteredMessages}
                    setMessages={setFilteredMessages}
                    connection={connection}
                    getUsers={getUsers}
                    margin={typing.length !== 0 && typing.includes(openChat.id)}
                  />
                );
              })}
              {typing.length !== 0 && typing.includes(openChat.id) && (
                <div
                  className={`absolute bottom-0 flex justify-center items-center gap-2 w-16 h-10 mt-10                 bg-blue-500 text-white left-0 font-medium rounded-lg p-2 animate-fade`}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-typing [animation-delay:-1s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-typing [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-typing [animation-delay:0.4s]"></div>
                  <div className="absolute mt-10"></div>
                </div>
              )}
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
                onChange={(e) => {
                  setMessage({ ...message, messageText: e.target.value });
                  if (e.target.value.length !== 0 && e.target.value !== "")
                    connection
                      .invoke("SendTyping", userId, openChat.id)
                      .catch((err) => console.err(err));
                  else if (
                    e.target.value.length === 0 ||
                    e.target.value === ""
                  ) {
                    connection.invoke("RemoveTyping", userId, openChat.id);
                  }
                }}
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
