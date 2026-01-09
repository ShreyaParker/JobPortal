import React, {useState} from 'react';
import {Button} from "@/components/ui/button.jsx";
import {ArrowLeft, ArrowRight, Home, LayoutGrid} from "lucide-react";
import {Link, Navigate, useParams} from "react-router-dom";
import PersonalDetail from "@/components/airesume/resume/components/forms/PersonalDetail.jsx";
import Summery from "@/components/airesume/resume/components/forms/Summery.jsx";
import Experience from "@/components/airesume/resume/components/forms/Experience.jsx";
import Education from "@/components/airesume/resume/components/forms/Education.jsx";
import Skills from "@/components/airesume/resume/components/forms/Skills.jsx";

const FormSection = () => {
    const [activeFormIndex,setActiveFormIndex]=useState(1);
    const [enableNext,setEnableNext]=useState(true);
    const {resumeId}=useParams();
    return (
        <div>
            <div className='flex justify-between items-center'>
                <div className='flex gap-5'>
                    <Link to={"/airesume"}>
                        <Button><Home/></Button>
                    </Link>
                </div>

                <div className='flex gap-2'>
                    {activeFormIndex > 1
                        && <Button size="sm"
                                   onClick={() => setActiveFormIndex(activeFormIndex - 1)}> <ArrowLeft/> </Button>}
                    <Button
                        disabled={!enableNext}
                        className="flex gap-2" size="sm"
                        onClick={() => setActiveFormIndex(activeFormIndex + 1)}
                    > Next
                        <ArrowRight/> </Button>
                </div>
            </div>
            {activeFormIndex==1?
                <PersonalDetail enabledNext={(v)=>setEnableNext(v)} />
                :activeFormIndex==2?
                    <Summery  enabledNext={(v)=>setEnableNext(v)} />

                    :activeFormIndex==3?
                        <Experience  enabledNext={(v)=>setEnableNext(v)} />
                        :activeFormIndex==4?
                            <Education  enabledNext={(v)=>setEnableNext(v)} />
                            :activeFormIndex==5?
                                <Skills enabledNext={(v)=>setEnableNext(v)} />
                                :activeFormIndex==6?
                                    <Navigate to={"/airesume/my-resume/"+resumeId+"/view"}/>
                                    :null
            }
        </div>
    );
};

export default FormSection;