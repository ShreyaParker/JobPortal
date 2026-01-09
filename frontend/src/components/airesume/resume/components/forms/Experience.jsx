import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import { RESUME_API_END_POINT } from '@/utils/constant';
import RichTextEditor from '../RichTextEditor';

const Experience = ({ enabledNext }) => {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    const emptyExperience = {
        title: '',
        companyName: '',
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        workSummery: '',
    };

    const [experienceList, setExperienceList] = useState(() => {
        return resumeInfo.experience && resumeInfo.experience.length > 0
            ? resumeInfo.experience
            : [];
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setResumeInfo(prev => ({
            ...prev,
            experience: experienceList,
        }));
    }, [experienceList]);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const updatedList = [...experienceList];
        updatedList[index][name] = value;
        setExperienceList(updatedList);
        setIsEditing(true);
        enabledNext(false);
    };

    const handleRichTextEditor = (e, name, index) => {
        const updatedList = [...experienceList];
        updatedList[index][name] = e.target.value;
        setExperienceList(updatedList);
        setIsEditing(true);
        enabledNext(false);
    };

    const addNewExperience = () => {
        setExperienceList(prev => [...prev, { ...emptyExperience }]);
        setIsEditing(true);
        enabledNext(false);
    };

    const removeExperience = (index) => {
        const updatedList = experienceList.filter((_, i) => i !== index);
        setExperienceList(updatedList);
        setIsEditing(true);
        enabledNext(false);
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${RESUME_API_END_POINT}/${params.resumeId}`, {
                ...resumeInfo,
                experience: experienceList,
            });
            toast.success('Experience updated!');
            enabledNext(true);
        } catch (err) {
            console.error('Save failed', err);
            toast.error('Failed to update experience.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Professional Experience</h2>
            <p>Add your previous job experience</p>

            <form onSubmit={onSave}>
                {experienceList.length > 0 ? (
                    experienceList.map((item, index) => (
                        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg relative'>
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="absolute top-2 right-2 text-red-500 text-xs"
                            >
                                <Trash2 />
                            </button>

                            <div>
                                <label className='text-xs'>Position Title</label>
                                <Input
                                    name="title"
                                    value={item.title}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label className='text-xs'>Company Name</label>
                                <Input
                                    name="companyName"
                                    value={item.companyName}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label className='text-xs'>City</label>
                                <Input
                                    name="city"
                                    value={item.city}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label className='text-xs'>State</label>
                                <Input
                                    name="state"
                                    value={item.state}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label className='text-xs'>Start Date</label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={item.startDate}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div>
                                <label className='text-xs'>End Date</label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={item.endDate}
                                    onChange={(e) => handleChange(index, e)}
                                />
                            </div>
                            <div className='col-span-2'>
                                <label className='text-xs'>Work Summary</label>
                                <RichTextEditor
                                    index={index}
                                    defaultValue={item.workSummery}
                                    onRichTextEditorChange={(e) =>
                                        handleRichTextEditor(e, 'workSummery', index)
                                    }
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="italic text-gray-500 my-5">No experience added yet.</p>
                )}

                <div className='flex justify-between items-center mt-4'>
                    <Button type="button" variant="outline" onClick={addNewExperience} className="text-primary">
                        + Add Experience
                    </Button>
                    <Button type="submit" disabled={loading || !isEditing}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Experience;
