import React, { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';

function ResumePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext);


    const themeColor = resumeInfo?.themeColor || '#333';

    return (
        <div
            className="shadow-lg h-full p-14"
            style={{
                borderTop: `20px solid ${themeColor}`,
            }}
        >

            <PersonalDetailPreview resumeInfo={resumeInfo} />


            <SummeryPreview resumeInfo={resumeInfo} />


            {resumeInfo?.experience?.length > 0 && (
                <ExperiencePreview resumeInfo={resumeInfo} />
            )}


            {resumeInfo?.education?.length > 0 && (
                <EducationalPreview resumeInfo={resumeInfo} />
            )}


            {resumeInfo?.skills?.length > 0 && (
                <SkillsPreview resumeInfo={resumeInfo} />
            )}
        </div>
    );
}

export default ResumePreview;
