import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RESUME_API_END_POINT } from "@/utils/constant.js";
import AddResume from "@/components/airesume/AddResume.jsx";
import Navbar from "@/components/shared/Navbar.jsx";
import ResumeCardItem from "@/components/airesume/components/ResumeCardItem.jsx";

const Resume = () => {
    const { user } = useSelector((store) => store.auth);
    const [resumeList, setResumeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    const GetResumeList = async () => {
        try {
            const res = await axios.get(`${RESUME_API_END_POINT}?email=${user.email}`);
            setResumeList(res.data.resumes || []);
        } catch (error) {
            console.error("Error fetching resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            GetResumeList();
        }
    }, [user]);

    const deleteResume = async () => {
        if (resumeToDelete) {
            try {
                setLoading(true);
                const res = await axios.delete(`${RESUME_API_END_POINT}/${resumeToDelete._id}`);
                if (res.status === 200) {
                    GetResumeList();
                    setShowDeleteModal(false);
                }
            } catch (error) {
                console.error("Error deleting resume:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="p-10 md:px-20 lg:px-32">
                <h2 className="font-bold text-3xl mb-4">My Resume</h2>
                <p className="mb-6 text-lg text-gray-700">Start Creating AI Resume for your Next Job Role</p>

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AddResume onResumeCreated={GetResumeList} />
                        {resumeList.length > 0 ? (
                            resumeList.map((resume) => (
                                resume && resume._id ? (
                                    <ResumeCardItem
                                        key={resume._id}
                                        resume={resume}
                                        refreshData={GetResumeList}
                                        setShowDeleteModal={setShowDeleteModal}
                                        setResumeToDelete={setResumeToDelete}
                                    />
                                ) : null
                            ))
                        ) : (
                            <div className="col-span-full text-center text-lg text-gray-500">No resumes found.</div>
                        )}
                    </div>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold">Are you sure you want to delete this resume?</h2>
                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded"
                                onClick={deleteResume}
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resume;
