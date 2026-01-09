import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, ChevronUp, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { updateApplicantStatus } from '@/redux/applicationSlice';

const shortlistingStatus = ['Accepted', 'Rejected'];
const allStatuses = ['All', 'Pending', ...shortlistingStatus];

const statusColors = {
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800'
};

const ApplicantsTable = () => {
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const [filterStatus, setFilterStatus] = useState('All');
    const [sortAscending, setSortAscending] = useState(false);
    const [loadingIds, setLoadingIds] = useState(new Set());

    const statusHandler = async (status, id) => {
        try {
            setLoadingIds(prev => new Set(prev).add(id));
            axios.defaults.withCredentials = true;

            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(updateApplicantStatus({ id, status: status.toLowerCase() }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoadingIds(prev => {
                const updated = new Set(prev);
                updated.delete(id);
                return updated;
            });
        }
    };

    const filteredAndSortedApplications = useMemo(() => {
        if (!applicants?.applications) return [];

        let filtered = [...applicants.applications];

        if (filterStatus !== 'All') {
            filtered = filtered.filter(
                app => (app.status || 'pending').toLowerCase() === filterStatus.toLowerCase()
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.applicant?.createdAt);
            const dateB = new Date(b.applicant?.createdAt);
            return sortAscending ? dateA - dateB : dateB - dateA;
        });

        return filtered;
    }, [applicants, filterStatus, sortAscending]);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">

                <div>
                    <label htmlFor="statusFilter" className="mr-2 font-medium text-gray-700">
                        Filter Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {allStatuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="text-gray-700 font-semibold">
                    Showing {filteredAndSortedApplications.length} applicant
                    {filteredAndSortedApplications.length !== 1 ? 's' : ''}
                </div>
            </div>

            <Table>
                <TableCaption>A list of your recently applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead
                            className="cursor-pointer select-none"
                            onClick={() => setSortAscending(prev => !prev)}
                            title="Sort by date"
                        >
                            Date
                            <span className="inline-block ml-1">
                                {sortAscending ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedApplications.map(item => {
                        const status = item.status || 'pending';
                        const isLoading = loadingIds.has(item._id);
                        const statusClass = statusColors[status.toLowerCase()] || statusColors.pending;

                        return (
                            <TableRow key={item._id} className="hover:bg-gray-50">
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || 'NA'}</TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600 hover:underline"
                                            href={item.applicant.profile.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.applicant.profile.resumeOriginalName}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.applicant?.createdAt?.split('T')[0] || 'NA'}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                                        {status.toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    {status.toLowerCase() === 'pending' ? (
                                        <Popover>
                                            <PopoverTrigger>
                                                <button
                                                    className="inline-flex items-center px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 transition"
                                                    disabled={isLoading}
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                {shortlistingStatus.map((stat, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => statusHandler(stat.toLowerCase(), item._id)}
                                                        className={`flex items-center my-2 cursor-pointer hover:text-blue-600 ${
                                                            isLoading ? 'opacity-50 pointer-events-none' : ''
                                                        }`}
                                                    >
                                                        {stat}
                                                    </div>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    ) : (
                                        <span className="text-gray-400 italic">Done</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {filteredAndSortedApplications.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-gray-500 italic">
                                No applicants found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
