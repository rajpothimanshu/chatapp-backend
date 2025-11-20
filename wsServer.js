// // const ws = require("ws");
// // const jwt = require("jsonwebtoken");
// // const fs = require("fs");
// // const Message = require("./models/messageModel");
// // const { clear } = require("console");
// // const { User } = require("./models/userModel");

// // const createWebSocketServer = (server) => {
// //   const wss = new ws.WebSocketServer({ server });

// //   wss.on("connection", (connection, req) => {
// //     const notifyAboutOnlinePeople = async () => {
// //       const onlineUsers = await Promise.all(
// //         Array.from(wss.clients).map(async (client) => {
// //           const { userId, username } = client;
// //           const user = await User.findById(userId);
// //           const avatarLink = user ? user.avatarLink : null;
// //           return {
// //             userId,
// //             username,
// //             avatarLink,
// //           };
// //         })
// //       );

// //       [...wss.clients].forEach((client) => {
// //         client.send(
// //           JSON.stringify({
// //             online: onlineUsers,
// //           })
// //         );
// //       });
// //     };

// //     connection.isAlive = true;
// //     connection.timer = setInterval(() => {
// //       connection.ping();
// //       connection.deathTimer = setTimeout(() => {
// //         connection.isAlive = false;
// //         clearInterval(connection.timer);
// //         connection.terminate();
// //         notifyAboutOnlinePeople();
// //         console.log("dead");
// //       }, 1000);
// //     }, 5000);

// //     connection.on("pong", () => {
// //       clearTimeout(connection.deathTimer);
// //     });

// //     const cookies = req.headers.cookie;
// //     if (cookies) {
// //       const tokenString = cookies
// //         .split(";")
// //         .find((str) => str.startsWith("authToken="));
// //       if (tokenString) {
// //         const token = tokenString.split("=")[1];
// //         jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
// //           if (err) console.log(err);
// //           if (userData) {
// //             const { _id, firstName, lastName } = userData;
// //             connection.userId = _id;
// //             connection.username = `${firstName} ${lastName}`;
// //           }
// //         });
// //       }
// //     }

// //     connection.on("message", async (message) => {
// //       const messageData = JSON.parse(message.toString());
// //       const { recipient, text } = messageData;

// //       const msgDoc = await Message.create({
// //         sender: connection.userId,
// //         recipient,
// //         text,
// //       });

// //       if (recipient && text) {
// //         [...wss.clients].forEach((client) => {
// //           if (client.userId === recipient) {
// //             client.send(
// //               JSON.stringify({
// //                 sender: connection.username,
// //                 text,
// //                 id: msgDoc._id,
// //               })
// //             );
// //           }
// //         });
// //       }
// //     });

// //     notifyAboutOnlinePeople();

// //     // Sending online user list to all clients
// //     // Log online users to the console
// //     console.log("New client connected");
// //   });
// // };

// // module.exports = createWebSocketServer;


// const ws = require("ws");
// const jwt = require("jsonwebtoken");
// const Message = require("./models/messageModel");
// const { User } = require("./models/userModel");

// const createWebSocketServer = (server) => {
//   const wss = new ws.WebSocketServer({ server });

//   wss.on("connection", async (connection, req) => {

//     // -----------------------------
//     // AUTHENTICATE USER IMMEDIATELY
//     // -----------------------------
//     try {
//       const cookies = req.headers.cookie || "";
//       const tokenString = cookies
//         .split(";")
//         .find((str) => str.trim().startsWith("authToken="));

//       if (tokenString) {
//         const token = tokenString.split("=")[1];
//         const userData = jwt.verify(token, process.env.JWTPRIVATEKEY); // SYNC

//         connection.userId = userData._id;
//         connection.username = `${userData.firstName} ${userData.lastName}`;

//         console.log("WS Authenticated:", connection.userId);
//       }
//     } catch (err) {
//       console.log("WS Token ERROR:", err.message);
//       connection.close();
//       return;
//     }

//     // -----------------------------------
//     // SEND UPDATED ONLINE USERS TO ALL
//     // -----------------------------------
//     const notifyAboutOnlinePeople = async () => {
//       const onlineUsers = await Promise.all(
//         Array.from(wss.clients).map(async (client) => {
//           const user = await User.findById(client.userId);
//           return {
//             userId: client.userId,
//             username: client.username,
//             avatarLink: user?.avatarLink || null,
//           };
//         })
//       );

//       wss.clients.forEach((client) => {
//         client.send(JSON.stringify({ online: onlineUsers }));
//       });
//     };

//     // -------------------
//     // HEARTBEAT
//     // -------------------
//     connection.isAlive = true;

//     connection.on("pong", () => {
//       connection.isAlive = true;
//     });

//     const interval = setInterval(() => {
//       if (!connection.isAlive) {
//         clearInterval(interval);
//         connection.terminate();
//         notifyAboutOnlinePeople();
//         return;
//       }

//       connection.isAlive = false;
//       connection.ping();
//     }, 5000);

//     connection.on("close", () => {
//       clearInterval(interval);
//       notifyAboutOnlinePeople();
//     });

//     // -----------------------------------
//     // MESSAGE HANDLER
//     // -----------------------------------
//     connection.on("message", async (data) => {
//       try {
//         if (!connection.userId) {
//           console.log("❌ Rejected message: No sender userId");
//           return;
//         }

//         const msg = JSON.parse(data.toString());
//         const { recipient, text } = msg;

//         if (!recipient || !text.trim()) return;

//         // Save in DB
//         const messageDoc = await Message.create({
//           sender: connection.userId,
//           recipient,
//           text,
//         });

//         // Send to recipient
//         wss.clients.forEach((client) => {
//           if (client.userId === recipient) {
//             client.send(
//               JSON.stringify({
//                 _id: messageDoc._id,
//                 text,
//                 sender: connection.userId,
//                 recipient,
//               })
//             );
//           }
//         });

//       } catch (err) {
//         console.log("Message error:", err);
//       }
//     });

//     notifyAboutOnlinePeople();
//     console.log("New client connected:", connection.userId);
//   });
// };

// module.exports = createWebSocketServer;



const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./models/messageModel");
const { User } = require("./models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", async (connection, req) => {

    // -----------------------------
    // AUTHENTICATE USER
    // -----------------------------
    try {
      const cookies = req.headers.cookie || "";
      const tokenString = cookies
        .split(";")
        .find((str) => str.trim().startsWith("authToken="));

      if (tokenString) {
        const token = tokenString.split("=")[1];
        const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);

        connection.userId = userData._id;
        connection.username = `${userData.firstName} ${userData.lastName}`;

        console.log("WS Authenticated:", connection.userId);
      }
    } catch (err) {
      console.log("WS Token ERROR:", err.message);
      connection.close();
      return;
    }

    // -----------------------------
    // SEND ONLINE USERS
    // -----------------------------
    const notifyAboutOnlinePeople = async () => {
      const onlineUsers = await Promise.all(
        Array.from(wss.clients).map(async (client) => {
          const user = await User.findById(client.userId);
          return {
            userId: client.userId,
            username: client.username,
            avatarLink: user?.avatarLink || null,
          };
        })
      );

      wss.clients.forEach((client) => {
        client.send(JSON.stringify({ online: onlineUsers }));
      });
    };

    // -----------------------------
    // HEARTBEAT
    // -----------------------------
    connection.isAlive = true;

    connection.on("pong", () => {
      connection.isAlive = true;
    });

    const interval = setInterval(() => {
      if (!connection.isAlive) {
        clearInterval(interval);
        connection.terminate();
        notifyAboutOnlinePeople();
        return;
      }

      connection.isAlive = false;
      connection.ping();
    }, 5000);

    // -----------------------------
    // MESSAGE HANDLER
    // -----------------------------
    connection.on("message", async (data) => {
      try {
        if (!connection.userId) return;

        const msg = JSON.parse(data.toString());
        const { recipient, text } = msg;

        if (!recipient || !text.trim()) return;

        // Save message
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });

        // Send message to BOTH sender and receiver
        wss.clients.forEach((client) => {
          if (client.userId === recipient || client.userId === connection.userId) {
            client.send(
              JSON.stringify({
                _id: messageDoc._id,
                text,
                sender: connection.userId,
                recipient,
              })
            );
          }
        });

      } catch (err) {
        console.log("Message error:", err);
      }
    });

    notifyAboutOnlinePeople();
    console.log("New client connected:", connection.userId);
  });
};

module.exports = createWebSocketServer;
