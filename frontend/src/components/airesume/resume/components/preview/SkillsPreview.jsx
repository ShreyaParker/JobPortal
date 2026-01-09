import React from 'react';

function SkillsPreview({ resumeInfo }) {
    return (
        <div className='my-6'>
            <h2
                className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                Skills
            </h2>
            <hr style={{ borderColor: resumeInfo?.themeColor }} />

            <div className='skills-container grid grid-cols-1 sm:grid-cols-2 gap-3 my-4'>
                {resumeInfo?.skills.map((skill, index) => (
                    <div key={index} className='flex items-center gap-3 min-w-0'>

                        <h2
                            className='skill-name text-xs truncate max-w-[120px] min-w-[60px]'
                            style={{
                                fontSize: '12px',
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                                color: 'black'
                            }}
                        >
                            {skill.name}
                        </h2>


                        <div
                            className='skill-bar-wrapper flex-1 bg-gray-200 rounded overflow-hidden'
                            style={{
                                height: '8px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '4px'
                            }}
                        >
                            <div
                                className='skill-bar'
                                style={{
                                    backgroundColor: resumeInfo?.themeColor || '#FF4C4C',
                                    width: `${skill?.rating * 20}%`,
                                    height: '100%',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkillsPreview;
