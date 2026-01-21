import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, LoaderCircle, Trash2Icon } from 'lucide-react';
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/constant.js";
import { useParams } from "react-router-dom";
import { toast } from 'sonner';

import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
        responseMimeType: "application/json",
    },
});


function Education({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();

    const [educationalList, setEducationalList] = useState([
        {
            universityName: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: '',
        },
    ]);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (resumeInfo?.education && Array.isArray(resumeInfo.education)) {
            setEducationalList(resumeInfo.education);
        }
    }, [resumeInfo]);

    const handleChange = (event, index) => {
        const newEntries = [...educationalList];
        const { name, value } = event.target;
        newEntries[index][name] = value;

        setEducationalList(newEntries);
        setResumeInfo((prev) => ({
            ...prev,
            education: newEntries,
        }));

        setIsEditing(true);
        enabledNext(false);
    };

    const generateEducationDescription = async (index) => {
        const educationData = educationalList[index];
        setLoading(true);

        // UPDATED PROMPT
        const prompt = `
        University Name: ${educationData.universityName},
        Degree: ${educationData.degree},
        Major: ${educationData.major},
        Start Date: ${educationData.startDate},
        End Date: ${educationData.endDate},
        
        Generate a professional resume description for this education experience.
        
        IMPORTANT: Return the response strictly in JSON format with a single key "Description".
        Example structure: { "Description": "Your generated description here..." }
        `;

        try {
            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            console.log("AI Response: ", responseText);

            const parsed = JSON.parse(responseText);

            // Now this check will pass because the AI will force the key 'Description'
            if (parsed && parsed.Description) {
                const aiDescription = parsed.Description;
                const newEntries = [...educationalList];
                newEntries[index].description = aiDescription;
                setEducationalList(newEntries);
                setResumeInfo((prev) => ({
                    ...prev,
                    education: newEntries,
                }));
                setIsEditing(true);
                enabledNext(false);

                toast.success('AI description generated successfully!');
            } else {
                console.error("AI response does not contain a valid 'Description'.", parsed);

                // Fallback: If AI still sends a different key, try to grab the first value found
                const firstKey = Object.keys(parsed)[0];
                if(firstKey) {
                    const fallbackDescription = parsed[firstKey];
                    // ... repeat save logic with fallbackDescription if you want extra safety
                }

                toast.error('Failed to generate AI description.');
            }
        } catch (error) {
            console.error("Error generating description:", error);
            toast.error('Error generating AI description. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addNewEducation = () => {
        const updated = [
            ...educationalList,
            {
                universityName: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ];
        setEducationalList(updated);
        setResumeInfo((prev) => ({ ...prev, education: updated }));
        setIsEditing(true);
        enabledNext(false);

        toast.success('New education added.');
    };

    const removeEducation = (index) => {
        const updated = educationalList.filter((_, i) => i !== index);
        setEducationalList(updated);
        setResumeInfo((prev) => ({ ...prev, education: updated }));
        setIsEditing(true);
        enabledNext(false);

        toast.success('Education entry removed.');
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${RESUME_API_END_POINT}/${params.resumeId}`, {
                education: educationalList,
            });
            console.log("Resume updated:", res.data);
            setResumeInfo((prev) => ({
                ...prev,
                education: educationalList,
            }));
            enabledNext(true);
            toast.success('Education details saved successfully!');
        } catch (error) {
            console.error("Error updating resume:", error);
            toast.error('Failed to save education details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Education</h2>
            <p>Add your educational details</p>

            <form onSubmit={onSave}>
                {educationalList.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg relative">
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="absolute top-2 right-2 text-red-500 text-xs underline"
                        >
                            <Trash2Icon />
                        </button>

                        <div className="col-span-2">
                            <label>University Name</label>
                            <Input
                                name="universityName"
                                onChange={(e) => handleChange(e, index)}
                                value={item.universityName}
                            />
                        </div>
                        <div>
                            <label>Degree</label>
                            <Input
                                name="degree"
                                onChange={(e) => handleChange(e, index)}
                                value={item.degree}
                            />
                        </div>
                        <div>
                            <label>Major</label>
                            <Input
                                name="major"
                                onChange={(e) => handleChange(e, index)}
                                value={item.major}
                            />
                        </div>
                        <div>
                            <label>Start Date</label>
                            <Input
                                type="date"
                                name="startDate"
                                onChange={(e) => handleChange(e, index)}
                                value={item.startDate}
                            />
                        </div>
                        <div>
                            <label>End Date</label>
                            <Input
                                type="date"
                                name="endDate"
                                onChange={(e) => handleChange(e, index)}
                                value={item.endDate}
                            />
                        </div>

                        <div className="col-span-2 mt-3 flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={() => generateEducationDescription(index)}
                                type="button"
                                size="sm"
                                className="border-primary text-primary flex gap-2"
                                disabled={loading}
                            >
                                <Brain className="h-4 w-4" /> Generate Description from AI
                            </Button>
                        </div>

                        <div className="col-span-2">
                            <label>Description</label>
                            <Textarea
                                name="description"
                                onChange={(e) => handleChange(e, index)}
                                value={item.description}
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                    <Button type="button" variant="outline" onClick={addNewEducation} className="text-primary">
                        + Add More Education
                    </Button>

                    <Button type="submit" disabled={loading || !isEditing}>
                        {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Education;
