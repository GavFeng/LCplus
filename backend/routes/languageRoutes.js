const express = require("express");
const {
    createLanguage,
    getLanguage,
    getLanguageById,
    updateLanguage,
    deleteLanguage
} = require("../controllers/languageController");

const router = express.Router();

router.post("/", createLanguage);
router.get("/", getLanguage);
router.get("/:id", getLanguageById);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

module.exports = router;
