const Language = require("../models/Language");

exports.createLanguage = async (req, res) => {
    try {
        const language = await Language.create(req.body);
        res.status(201).json(language);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: `Language already exists` });
        }
        res.status(400).json({message: err.message});
    }
};

exports.getLanguage = async (req, res) => {
    try {
        const languages = await Language.find();
        res.json(languages);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getLanguageById = async (req, res) => {
    try {
        const { id } = req.params;
        const language = await Language.findById(id);
        if (!language) return res.status(404).json({message: "Language Not Found"});
        res.status(200).json(language);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const language = await Language.findById(id);
        if (!language) return res.status(404).json({message: "Language Not Found"});

        language.set(req.body);
        await language.save();

        res.json(language);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const language = await Language.findByIdAndDelete(id);
        if (!language) return res.status(404).json({message: "Language Not Found"});
        res.status(200).json({
            message: "Successfully Deleted Language",
            id: language._id,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}