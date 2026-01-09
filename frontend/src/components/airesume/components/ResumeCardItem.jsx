import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EditIcon, Trash2Icon, Notebook } from "lucide-react";

const ResumeCardItem = ({ resume, setShowDeleteModal, setResumeToDelete }) => {
    const navigate = useNavigate();

    const onDeleteClick = () => {
        setResumeToDelete(resume);
        setShowDeleteModal(true);
    };

    return (
        <div className="relative group">
            <Link to={`/airesume/resume/${resume._id}/edit`}>
                <div
                    className="p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4"
                    style={{ borderColor: resume?.themeColor }}
                >
                    <div className="flex items-center justify-center h-[180px]">
                        <Notebook />
                    </div>
                </div>
            </Link>

            <div
                className="border p-3 flex justify-between items-center text-white rounded-b-lg shadow-lg"
                style={{ background: resume?.themeColor }}
            >
                <h2 className="text-sm truncate">{resume.title}</h2>

                <div className="flex space-x-4">
                    <button
                        onClick={() => navigate(`/airesume/resume/${resume._id}/edit`)}
                        className="text-white hover:text-blue-500"
                    >
                        <EditIcon className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => navigate(`/airesume/my-resume/${resume._id}/view`)}
                        className="text-white hover:text-blue-500"
                    >
                        <EyeIcon className="w-5 h-5" />
                    </button>

                    <button
                        onClick={onDeleteClick}
                        className="text-white hover:text-red-500"
                    >
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeCardItem;
