import React from 'react'

function ExperiencePreview({ resumeInfo }) {

    const cleanWorkSummary = (workSummery) => {

        return workSummery.replace(/```html/g, '').replace(/```/g, '').trim();
    };

    return (
        <div className='my-6'>
            <h2 className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                Professional Experience
            </h2>
            <hr style={{ borderColor: resumeInfo?.themeColor }} />

            {resumeInfo?.experience?.map((experience, index) => (
                <div key={index} className='my-5'>
                    <h2 className='text-sm font-bold'
                        style={{ color: resumeInfo?.themeColor }}
                    >
                        {experience?.title}
                    </h2>
                    <h2 className='text-xs flex justify-between'>
                        <span>{experience?.companyName}, {experience?.city}, {experience?.state}</span>
                        <span>{experience?.startDate} to {experience?.currentlyWorking ? 'Present' : experience?.endDate}</span>
                    </h2>
                    <div
                        className='text-xs my-2'
                        dangerouslySetInnerHTML={{
                            __html: cleanWorkSummary(experience?.workSummery),
                        }}
                    />
                </div>
            ))}
        </div>
    );
}

export default ExperiencePreview;
