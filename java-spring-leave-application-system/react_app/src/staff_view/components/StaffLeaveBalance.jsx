import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import axios from "axios";

function StaffLeaveBalance(
    {
        staffId,
        staffName,
    }) {

    const [staffBalance, setStaffBalance] = useState(null);

    useEffect(() => {
            axios.get("http://localhost:8080/api/subordinates/" + staffId, {withCredentials: true})
                .then(response => {
                        let annualLeave = response.data.filter(d => d['leaveType']['leaveCode'] === 1)[0];
                        let annualLeaveBalance = annualLeave['currentBalance'] + annualLeave['forwardBalance'];

                        let medicalLeave = response.data.filter(d => d['leaveType']['leaveCode'] === 2)[0];
                        let medicalLeaveBalance = medicalLeave['currentBalance'];

                        let compensationLeave = response.data.filter(d => d['leaveType']['leaveCode'] === 3)[0];
                        let compensationLeaveBalance = compensationLeave['currentBalance'];

                        setStaffBalance({
                            annualLeaveBalance: annualLeaveBalance,
                            medicalLeaveBalance: medicalLeaveBalance,
                            compensationLeaveBalance: compensationLeaveBalance,
                        })
                    }
                )
                .catch(err => console.log(err));
        }, [staffId]
    );

    return (
        <div
            className="flex flex-col p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 mx-auto mt-4 max-w-3xl"
            role="alert">
            <div className="flex items-center mb-2">
                <svg className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                </svg>
                <h2 className="text-lg font-bold">Employee name: {staffName}</h2>
            </div>
            {staffBalance && (
                <ul className="ml-7" style={{fontSize: "medium"}}>
                    <li>Annual
                        Leave: {staffBalance.annualLeaveBalance} {staffBalance.annualLeaveBalance > 1 ? "days" : "day"}</li>
                    <li>Medical
                        Leave: {staffBalance.medicalLeaveBalance} {staffBalance.medicalLeaveBalance > 1 ? "days" : "day"}</li>
                    <li>Compensation
                        Leave: {staffBalance.compensationLeaveBalance} {staffBalance.compensationLeaveBalance > 1 ? "days" : "day"}</li>
                </ul>
            )}
        </div>
    );
}

export default StaffLeaveBalance;

StaffLeaveBalance.propTypes = {
    staffId: PropTypes.number.isRequired,
    staffName: PropTypes.string.isRequired,
};



