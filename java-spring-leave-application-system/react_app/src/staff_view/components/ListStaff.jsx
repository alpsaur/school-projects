import React, {useEffect} from 'react';
import Staff from "./Staff.jsx";
import axios from "axios";

import '../../styles.css'
import PropTypes from "prop-types";

export default function ListStaff({onViewClick}) {
    const [myStaffList, updateMyStaffList] = React.useState([]);

    useEffect(() => {
        console.log("retrieving mystaff list");
        retrieveStaffList();
    }, []);

    function retrieveStaffList() {
        axios
            .get("http://localhost:8080/api/subordinates", {withCredentials: true})
            .then(response => {
                updateMyStaffList(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            <main>
                <section>
                    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                        <h2 className="mb-5" style={{fontSize: "x-large", textAlign: "center", fontWeight: "bold"}}>My
                            Subordinates List</h2>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Employee name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Employee id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Phone Number
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Email address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Leave Balance
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {myStaffList.map(staff => <Staff myStaff={staff} key={staff.id}
                                                                 onViewClick={onViewClick}/>)}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

ListStaff.propTypes = {
    onViewClick: PropTypes.func,
};