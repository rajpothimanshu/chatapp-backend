// const mongoose = require("mongoose");
// const AvatarSchema = new mongoose.Schema(
//     {
//         link: {
//             type: String,


//             required: true,
//             default: "https://i.imgur.com/qGsYvAK.png",
//         },
//     },
//     { timestamps: true }
// );
// const Avatar = mongoose.model("Avatar", AvatarSchema);
// module.exports = Avatar


const mongoose = require("mongoose");

const AvatarSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      default: "https://i.imgur.com/qGsYvAK.png", // default avatar
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Avatar = mongoose.model("Avatar", AvatarSchema);

module.exports = Avatar;
