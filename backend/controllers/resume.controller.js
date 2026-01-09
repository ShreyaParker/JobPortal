import {Resume} from "../models/resume.model.js";
import mongoose from "mongoose";
export const createResume = async (req, res) => {
    try {
        const { title, resumeId, userEmail, userName } = req.body;

        if (!title || !resumeId || !userEmail || !userName) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const newResume = new Resume({
            title,
            resumeId,
            userEmail,
            userName
        });

        await newResume.save();

        res.status(201).json({
            message: "Resume created successfully.",
            resume: newResume
        });
    } catch (error) {
        console.error("Error creating resume:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getResumesByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email query parameter is required." });
        }

        const resumes = await Resume.find({ userEmail: email });

        res.status(200).json({ resumes });
    } catch (error) {
        console.error("Error fetching resumes:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
export const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const updateData = req.body;
        console.log(updateData)


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID." });
        }


        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            { $set: updateData }, // Dynamically update fields
            { new: true, runValidators: true } // Ensure validation is run on update
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        res.status(200).json({
            message: "Resume updated successfully",
            resume: updatedResume,
        });
    } catch (error) {
        console.error("Error updating resume:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID." });
        }

        const resume = await Resume.findById(id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        res.status(200).json({ resume });
    } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


export const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID." });
        }

        const deletedResume = await Resume.findByIdAndDelete(id);

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found." });
        }

        res.status(200).json({
            message: "Resume deleted successfully.",
            resume: deletedResume,
        });
    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
