import PropTypes from "prop-types";

import '../../styles.css'


export default function Staff({myStaff, onViewClick}) {
    console.log(myStaff)
    return (
        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">

            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {myStaff.firstName + " " + myStaff.lastName}
            </th>
            <td className="px-6 py-4">
                {myStaff.id}
            </td>
            <td className="px-6 py-4">
                {myStaff.phoneNumber}
            </td>
            <td className="px-6 py-4">
                {myStaff.email}
            </td>
            <td className="px-6 py-4">
                {/* eslint-disable-next-line react/prop-types */}
                <a onClick={() => onViewClick(myStaff)}
                   className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</a>
            </td>
        </tr>
    );
}

// Define prop types for the component
Staff.propTypes = {
    myStaff: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        phoneNumber: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
    }).isRequired,
    onViewClick: PropTypes.func,
};
