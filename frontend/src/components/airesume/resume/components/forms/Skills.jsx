import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { RESUME_API_END_POINT } from '@/utils/constant';

function Skills({ enabledNext }) {
    const [skillsList, setSkillsList] = useState([
        {
            name: '',
            rating: 0,
        },
    ]);
    const { resumeId } = useParams();
    const [loading, setLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (resumeInfo?.skills?.length > 0) {
            setSkillsList(resumeInfo.skills);
        }
    }, []);

    const handleChange = (index, name, value) => {
        const newEntries = [...skillsList];
        newEntries[index][name] = value;
        setSkillsList(newEntries);
        setIsEditing(true);
        enabledNext(false);
    };

    const AddNewSkills = () => {
        setSkillsList([
            ...skillsList,
            {
                name: '',
                rating: 0,
            },
        ]);
        setIsEditing(true);
        enabledNext(false);
    };

    const RemoveSkill = (index) => {
        const newEntries = [...skillsList];
        newEntries.splice(index, 1);
        setSkillsList(newEntries);
        setIsEditing(true);
        enabledNext(false);
    };

    const RemoveLastSkill = () => {
        setSkillsList((prev) => prev.slice(0, -1));
        setIsEditing(true);
        enabledNext(false);
    };

    const onSave = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${RESUME_API_END_POINT}/${resumeId}`, {
                skills: skillsList.map(({ id, ...rest }) => rest),
            });

            const updatedResume = response.data.resume;
            toast.success('Skills updated!');
            setResumeInfo(updatedResume);
            enabledNext(true);
        } catch (err) {
            console.error('Failed to update skills:', err);
            toast.error('Failed to update skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setResumeInfo((prev) => ({
            ...prev,
            skills: skillsList,
        }));
    }, [skillsList]);

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <p>Add your top professional key skills</p>

            <div>
                {skillsList.map((item, index) => (
                    <div
                        key={index}
                        className='flex justify-between items-center mb-2 border rounded-lg p-3'
                    >
                        <div className='w-full mr-4'>
                            <label className='text-xs'>Name</label>
                            <Input
                                className='w-full'
                                value={item.name}
                                onChange={(e) =>
                                    handleChange(index, 'name', e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className='text-xs'>Rating</label>
                            <Rating
                                style={{ maxWidth: 120 }}
                                value={item.rating}
                                onChange={(v) => handleChange(index, 'rating', v)}
                            />
                        </div>
                        <Button
                            variant='outline'
                            className='text-red-500 ml-4'
                            onClick={() => RemoveSkill(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>

            <div className='flex justify-between mt-4'>
                <div className='flex gap-2'>
                    <Button variant='outline' onClick={AddNewSkills} className='text-primary'>
                        + Add More Skill
                    </Button>
                    <Button variant='outline' onClick={RemoveLastSkill} className='text-primary'>
                        - Remove Last Skill
                    </Button>
                </div>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default Skills;
