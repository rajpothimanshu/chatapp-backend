// const Avatar = require("../models/avatars");

// // Add a new avatar link
// async function avatarController(req, res) {
//   const { link } = req.body;

//   // Check if the link is provided
//   if (!link) {
//     return res.status(400).json({ error: "Link is required" });
//   }

//   try {
//     // Create a new avatar entry in the database
//     const newAvatar = new Avatar({ link });
//     await newAvatar.save();

//     // Return success response
//     return res
//       .status(201)
//       .json({ success: true, message: "Avatar link added successfully" });
//   } catch (error) {
//     console.error("Error in avatarController:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// // Get all avatars
// async function getAllAvatars(req, res) {
//   try {
//     // Fetch all avatars from the database
//     const avatars = await Avatar.find();

//     // Return the list of avatars
//     return res.status(200).json({ success: true, avatars });
//   } catch (error) {
//     console.error("Error in getAllAvatars:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }

// module.exports = { avatarController, getAllAvatars };


// 


const Avatar = require("../models/avatars");

// Add a new avatar
exports.avatarController = async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Avatar link is required" });
    }

    const avatar = await Avatar.create({ link });
    res.status(201).json({ message: "Avatar created successfully", avatar });
  } catch (error) {
    console.error("Error creating avatar:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all avatars
exports.getAllAvatars = async (req, res) => {
  try {
    const avatars = await Avatar.find();
    res.status(200).json({ avatars });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Seed default avatars (optional)
exports.seedAvatars = async (req, res) => {
  try {
    const links = [
      "https://imgur.com/qGsYvAK",
      "https://i.pravatar.cc/150?img=2",
      "https://i.pravatar.cc/150?img=3",
      "https://i.pravatar.cc/150?img=4"
    ];

    // Clear existing avatars
    await Avatar.deleteMany({});
    
    // Insert new avatars
    const avatars = await Avatar.insertMany(links.map(link => ({ link })));

    res.status(200).json({ message: "Avatars seeded successfully", avatars });
  } catch (error) {
    console.error("Error seeding avatars:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
