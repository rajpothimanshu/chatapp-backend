// // const logoutController = async (req, res) => {
// //   try {
// //     res.clearCookie("authToken", {
// //       httpOnly: true,
// //       sameSite: "lax",
// //       secure: false, // change to true if using HTTPS
// //     });
// //     res.status(200).json({ message: "Logged out successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Logout failed" });
// //   }
// // };

// // module.exports = logoutController;


// const logoutController = async (req, res) => {
//   try {
//     res.clearCookie("authToken", {
//       httpOnly: true,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
//     });

//     return res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     return res.status(500).json({ message: "Logout failed" });
//   }
// };

// module.exports = logoutController;


const logOutController = async (req, res) => {
   try {
    res.clearCookie("token", {
  httpOnly: true,
  sameSite: "lax",   // must NOT be "none" locally
  secure: false,     // must NOT be true without https
});


    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }

}


module.exports = logOutController;
