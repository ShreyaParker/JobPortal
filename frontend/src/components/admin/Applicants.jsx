import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const fetchAllApplicants = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
            dispatch(setAllApplicants(res.data.job));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllApplicants();
    }, [params.id]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants {applicants?.applications?.length || 0}</h1>
                <ApplicantsTable jobId={params.id} refreshApplicants={fetchAllApplicants} />
            </div>
        </div>
    );
};

export default Applicants;
