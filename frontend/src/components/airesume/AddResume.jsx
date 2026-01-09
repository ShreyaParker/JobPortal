import { Loader2, PlusSquare } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";
import { v4 as uuidv4 } from "uuid";
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useSelector } from "react-redux";
import { RESUME_API_END_POINT } from "@/utils/constant.js";
import axios from "axios";

function AddResume({ onResumeCreated }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const uuid = uuidv4();

    const data = {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.email,
        userName: user?.fullname
    };

    const onCreate = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${RESUME_API_END_POINT}/createResume`, data);
            console.log(res);

            setOpenDialog(false);


            if (onResumeCreated) {
                onResumeCreated();
            }
        } catch (error) {
            console.error("Axios error:", error);
            alert("Failed to create resume. Check the console for more details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            Add a title for your new resume
                            <Input
                                className="my-2"
                                placeholder="Ex. Full Stack resume"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>

                        <div className='flex justify-end gap-5'>
                            <Button
                                onClick={() => setOpenDialog(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={onCreate}
                            >
                                {loading ? (
                                    <Loader2 className='animate-spin' />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;
