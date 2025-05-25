const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/BloodDonors', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Schema
const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  location: String,
  phonenumber: Number
});

const Donor = mongoose.model('Donor', donorSchema);

// Handle form submission
app.post('/register', async (req, res) => {
  const { name, bloodGroup, location ,phonenumber} = req.body;
  try {
    const donor = new Donor({ name, bloodGroup, location,phonenumber });
    await donor.save();
    res.send('✅ Donor data saved to MongoDB');
  } catch (err) {
    res.status(500).send('❌ Failed to save donor data');
  }
});


app.get('/search', async (req, res) => {
  try {
    const { location, bloodGroup } = req.query;

    if (!location) {
      return res.status(400).send("Location is required");
    }

    // Case-insensitive location search
    const locationQuery = { location: { $regex: new RegExp(location, "i") } };

    let bloodGroupQuery = {};

    if (bloodGroup && bloodGroup !== "0" && bloodGroup !== "") {
      if (bloodGroup.toUpperCase() === "O" || bloodGroup.toUpperCase() === "O+") {
        // If searching for O blood group, just search exact matches
        bloodGroupQuery = { bloodGroup: bloodGroup };
      } else {
        // For other blood groups, include donors with the selected group OR "O"
        bloodGroupQuery = {
          $or: [
            { bloodGroup: bloodGroup },
            { bloodGroup: /^O/i } // regex to match "O", "O+", "O-", etc.
          ]
        };
      }
    }

    // Combine location and blood group queries
    const query = {
      ...locationQuery,
      ...(Object.keys(bloodGroupQuery).length ? bloodGroupQuery : {})
    };

    const donors = await Donor.find(query);

    res.json(donors);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).send("Server error during search");
  }
});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
