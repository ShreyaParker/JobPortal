import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/constant.js";
import { LoaderCircle } from "lucide-react";
import { toast } from 'sonner';

const PersonalDetail = ({ enabledNext }) => {
    const params = useParams();
    const { resumeInfo = {}, setResumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {}, [resumeInfo]);

    const handleInputChange = (e) => {
        enabledNext(false);
        const { name, value } = e.target;

        const updatedData = {
            ...resumeInfo,
            [name]: value
        };

        setResumeInfo(updatedData);
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put(`${RESUME_API_END_POINT}/${params.resumeId}`, resumeInfo);
            enabledNext(true);
            toast.success("Personal details updated successfully!");
        } catch (error) {
            console.error("Error updating resume:", error);
            toast.error("Failed to update personal details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input name="firstName" value={resumeInfo.firstName || ""} required onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input name="lastName" value={resumeInfo.lastName || ""} required onChange={handleInputChange} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input name="jobTitle" value={resumeInfo.jobTitle || ""} required onChange={handleInputChange} />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input name="address" value={resumeInfo.address || ""} required onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input name="phone" value={resumeInfo.phone || ""} required onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input name="email" value={resumeInfo.email || ""} required onChange={handleInputChange} />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PersonalDetail;
