import express from 'express';
const router = express.Router();

import {
    createResume,
    deleteResume,
    getResumeById,
    getResumesByEmail,
    updateResume
} from "../controllers/resume.controller.js";
// POST /api/resume/createResume
router.post('/createResume',createResume)
router.get("/", getResumesByEmail);
router.put('/:id', updateResume);
router.get('/:id', getResumeById);
router.delete("/:id", deleteResume);
export default router;

