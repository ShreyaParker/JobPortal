import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import Navbar from "@/components/shared/Navbar.jsx";
import ResumePreview from "@/components/airesume/resume/components/ResumePreview.jsx";
import axios from 'axios';
import { RESUME_API_END_POINT } from '@/utils/constant.js';

function View() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const { resumeId } = useParams();

    useEffect(() => {
        fetchResumeInfo();
    }, []);

    const fetchResumeInfo = async () => {
        try {
            const response = await axios.get(`${RESUME_API_END_POINT}/${resumeId}`);
            if (response.data && response.data.resume) {
                setResumeInfo(response.data.resume);
            } else {
                console.error("Error fetching resume: No resume found");
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    if (!resumeInfo) {
        return <div>Loading...</div>;
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div id="no-print">
                <Navbar />
                <div className="my-10 mx-10 md:mx-20 lg:mx-36">
                    <h2 className="text-center text-2xl font-medium">
                        Congrats! Your Ultimate AI Generated Resume is ready!
                    </h2>
                    <p className="text-center text-gray-400">
                        Now you are ready to download your resume and you can share the unique resume URL with your friends and family.
                    </p>

                    <div className="flex justify-center px-44 my-10">
                        <Button onClick={handleDownload}>Download</Button>
                    </div>
                </div>
            </div>

            <div className="my-10 mx-10 md:mx-20 lg:mx-36" id="print-area">
                <div>
                    <ResumePreview  />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default View;
