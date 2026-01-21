import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Textarea } from '@/components/ui/textarea';
import { Brain, LoaderCircle } from 'lucide-react';
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

const promptTemplate = `Job Title: {jobTitle}, Based on this job title give me a list of summary suggestions for three experience levels: Senior, Mid-Level, and Fresher. Each item should be 3–4 lines and returned as an array of JSON objects. Each object must contain: "summary" and "experience_level" fields. Output only a JSON array.`;

function Summery({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summery, setSummery] = useState(resumeInfo?.summery || "");
    const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (summery) {
            setResumeInfo({
                ...resumeInfo,
                summery: summery
            });
        }
    }, [summery]);

    const GenerateSummeryFromAI = async () => {
        setLoading(true);
        const jobTitle = resumeInfo?.jobTitle || "Software Developer";
        const prompt = promptTemplate.replace("{jobTitle}", jobTitle);

        try {
            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();
            const parsed = JSON.parse(responseText);
            setAiGenerateSummeryList(parsed);
            toast.success('AI-generated summary suggestions fetched!');
        } catch (error) {
            console.error("Error generating summary:", error);
            toast.error('Failed to fetch AI-generated summary suggestions');
        } finally {
            setLoading(false);
            setIsEditing(true);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${RESUME_API_END_POINT}/${params.resumeId}`, {
                summery
            });

            setResumeInfo((prev) => ({
                ...prev,
                summery: summery,
            }));

            enabledNext(true);
            toast.success('Summary saved successfully!');
        } catch (error) {
            console.error("Error updating resume:", error);
            toast.error('Failed to save summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTextareaChange = (e) => {
        setSummery(e.target.value);
        setIsEditing(true);
        enabledNext(false);
    };

    const handleSuggestionClick = (item) => {
        setSummery(item?.summary);
        setIsEditing(true);
        enabledNext(false);
    };

    return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
            <h2 className="font-bold text-lg">Summary</h2>
            <p>Add summary for your job title</p>

            <form className="mt-7" onSubmit={onSave}>
                <div className="flex justify-between items-end">
                    <label>Add Summary</label>
                    <Button
                        variant="outline"
                        onClick={GenerateSummeryFromAI}
                        type="button"
                        size="sm"
                        className="border-primary text-primary flex gap-2"
                        disabled={loading}
                    >
                        <Brain className="h-4 w-4" /> Generate from AI
                    </Button>
                </div>
                <Textarea
                    className="mt-5"
                    required
                    value={summery}
                    onChange={handleTextareaChange}
                />
                <div className="mt-2 flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                    </Button>
                </div>
            </form>

            {aiGeneratedSummeryList && (
                <div className="my-5">
                    <h2 className="font-bold text-lg">Suggestions</h2>
                    {aiGeneratedSummeryList?.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(item)}
                            className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <h2 className="font-bold my-1 text-primary">Level: {item?.experience_level}</h2>
                            <p>{item?.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Summery;
