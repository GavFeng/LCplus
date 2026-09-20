require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const uploadImageRoutes = require("./routes/uploadImageRoutes");

const languageRoutes = require("./routes/languageRoutes");
const problemRoutes = require("./routes/problemRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) =>{
    res.send("Server is Running");
});

app.use("/api/uploadImage", uploadImageRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/tags", tagRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
