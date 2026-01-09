import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import ResumePreview from "@/components/airesume/resume/components/ResumePreview.jsx";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

import FormSection from "@/components/airesume/resume/components/FormSection.jsx";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/constant.js";
import Navbar from "@/components/shared/Navbar.jsx";

const EditResume = () => {
    const params = useParams();
    const [resumeInfo, setResumeInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${RESUME_API_END_POINT}/${params.resumeId}`);
                console.log(response?.data?.resume);

                if (response.data.resume) {
                    setResumeInfo(response.data.resume);
                    localStorage.setItem('resumeInfo', JSON.stringify(response.data.resume));
                } else {
                    const savedResumeInfo = JSON.parse(localStorage.getItem('resumeInfo'));
                    if (savedResumeInfo) {
                        setResumeInfo(savedResumeInfo);
                    } else {
                        setResumeInfo(dummy);
                    }
                }
            } catch (error) {
                console.error("Error fetching resume data:", error);
                const savedResumeInfo = JSON.parse(localStorage.getItem('resumeInfo'));
                if (savedResumeInfo) {
                    setResumeInfo(savedResumeInfo);
                } else {
                    setResumeInfo(dummy);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.resumeId]);

    useEffect(() => {
        if (resumeInfo) {
            localStorage.setItem('resumeInfo', JSON.stringify(resumeInfo));
        }
    }, [resumeInfo]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div>
                <Navbar />
                <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
                    <FormSection />
                    <ResumePreview />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
};

export default EditResume;
