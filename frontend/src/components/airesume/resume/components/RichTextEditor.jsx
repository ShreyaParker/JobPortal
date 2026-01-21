import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react';
import {
    BtnBold,
    BtnBulletList,
    BtnClearFormatting,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnStrikeThrough,
    BtnUnderline,
    Editor,
    EditorProvider,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Gemini import

// Gemini setup
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    generationConfig: {
        responseMimeType: 'text/plain',
    },
});

const PROMPT = 'Position Title: {positionTitle}. Based on this position title, give me 3-4 bullet points for my experience in a resume (No experience level and no JSON array). Provide result in HTML tags like <ul><li>...</li></ul>.';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue || '');
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const generateSummaryFromAI = async () => {
        const title = resumeInfo?.experience?.[index]?.title;

        if (!title) {
            toast('Please Add Position Title');
            return;
        }

        const prompt = PROMPT.replace('{positionTitle}', title);
        setLoading(true);

        try {
            const result = await model.generateContent(prompt);
            const responseText = await result.response.text();

            console.log("AI Response:", responseText);

            // Clean the response text, ensuring valid HTML is rendered.
            // Here, remove unnecessary characters like brackets if they exist
            const cleanedHTML = responseText
                .replace(/^\[|\]$/g, '')  // Remove unwanted brackets around the response
                .replace(/[\[\]]/g, '') // Remove any other brackets
                .trim();

            console.log("Cleaned AI Response:", cleanedHTML); // Debug the cleaned response

            // Update the value and trigger onChange
            setValue(cleanedHTML);
            onRichTextEditorChange({ target: { value: cleanedHTML } });
        } catch (error) {
            console.error('AI generation error:', error);
            toast.error('Failed to generate summary');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setValue(e.target.value);
        onRichTextEditorChange(e);
    };

    return (
        <div>
            <div className="flex justify-between my-2">
                <label className="text-xs">Summary</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSummaryFromAI}
                    disabled={loading}
                    className="flex gap-2 border-primary text-primary"
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <>
                            <Brain className="h-4 w-4" /> Generate from AI
                        </>
                    )}
                </Button>
            </div>
            <EditorProvider>
                <Editor value={value} onChange={handleChange}>
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;
