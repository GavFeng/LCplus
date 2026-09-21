const Problem = require("../models/Problem");

exports.createProblem = async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json(problem);
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(400).json({message: err.message});
    }
}

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find()
      .populate("tags", "name")
      .populate("solutions.language", "name")
      .sort({ problem: 1 });

    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id)
      .populate("tags", "name")
      .populate("solutions.language", "name");

    if (!problem) return res.status(404).json({ message: "Problem not found" });
    
     res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    

    problem.set(req.body);
    await problem.save();

    const updated = await Problem.findById(problem._id)
      .populate("tags", "name")
      .populate("solutions.language", "name");

    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByIdAndDelete(id);

    if (!problem) return res.status(404).json({ message: "Problem not found" });

    if (problem.examples?.length) {
      const deletePromises = [];

    problem.examples.forEach((example) => {
        example.images?.forEach((img) => {
          if (img.key) {
            deletePromises.push(deleteImageFromS3(img.key));
          }
        });
      });

      await Promise.allSettled(deletePromises);
    }

    res.status(200).json({
      message: "Problem deleted successfully",
      id: problem._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};