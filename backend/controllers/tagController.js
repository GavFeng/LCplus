const Tag = require("../models/Tag");


exports.createTag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getTag = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        res.status(500).json({message: err.message});
    }
}

exports.getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findById(id);
        if(!tag) return res.status(404).json({message: "Tag Not Found"});
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({message: err.message});
    }
};

exports.updateTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findById(id);
        if(!tag) return res.status(404).json({message: "Tag Not Found"});

        tag.set(req.body);
        await tag.save();

        res.json(tag);
    } catch (error) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findByIdAndDelete(id);
        if(!tag) return res.status(404).json({message: "Tag Not Found"});
        res.status(200).json({
            message: "Successfully Deleted Tag",
            id: tag._id,
        });
    } catch (error) {
        res.status(500).json({message: err.message});
    }
};