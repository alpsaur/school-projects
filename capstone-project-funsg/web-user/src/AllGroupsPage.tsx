import { useEffect, useState } from "react";
import axiosConfig from "./axiosConfig.tsx";
import Navbar from "./components/Navbar.tsx";
import './css/AllGroupsPage.css';

import {GroupDetailWithEvents} from "./model/GroupDetail.ts";
import {User} from "./model/User.ts";
import GroupHorizontalCard from "./components/GroupHorizontalCard.tsx";
import CategoryList from "./components/CategoryList.tsx";
import SortButton from "./components/SortButton.tsx";

const AllGroupsPage = () => {

    const [groupGrid, setGroupGrid] = useState<GroupDetailWithEvents[]>([]);
    const [filteredGroups, setFilteredGroups] = useState(groupGrid);

    useEffect(() => {
        axiosConfig.get('/groups')
            .then(response => {
                const formattedData = response.data.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    description: group.description,
                    categoryId: group.categoryId,
                    categoryName: group.categoryName,
                    status: group.status,
                    profileImagePath: group.profileImagePath || null,
                    host: group.host as User, // Assuming the `host` in the response is already a `User` object
                    members: group.members as User[] || [],
                    numberOfEvents:group.numberOfEvents// Assuming the `members` in the response are already `User` objects
                }));
                setGroupGrid(formattedData);
                setFilteredGroups(formattedData);
                console.log("groups",response.data)
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
            });
    }, []);

    const handleFilterSelect = (selected: string, filterType: string) => {
        let filtered = [...groupGrid];

        if (filterType === 'No. Members') {
            if (selected === '1-5') {
                filtered = groupGrid.filter(group => group.members.length >= 1 && group.members.length <= 5);
            } else if (selected === '5-10') {
                filtered = groupGrid.filter(group => group.members.length > 5 && group.members.length <= 10);
            } else if (selected === 'more than 10') {
                filtered = groupGrid.filter(group => group.members.length > 10);
            }
        } else if (filterType === 'No. Events') {
            // Apply age-based filtering logic here
            if (selected === '1-5') {
                filtered = groupGrid.filter(group => group.numberOfEvents >= 1 && group.numberOfEvents <= 5);
            } else if (selected === '5-10') {
                filtered = groupGrid.filter(group => group.numberOfEvents > 5 && group.numberOfEvents <= 10);
            } else if (selected === 'more than 10') {
                filtered = groupGrid.filter(group => group.numberOfEvents > 10);
            }        }

        setFilteredGroups(filtered);
    };

    return (
        <>
            <Navbar  />
            <CategoryList isShowSuggestion={false}/>
            <div className="all-groups-container">
                <h3 className="mt-4 title">Interest Groups</h3>
                <div className="nav-container">
                    <SortButton onFilterSelect={(selected)=> handleFilterSelect(selected, 'No. Members')} title='No. Members' content={['1-5','5-10','more than 10','all']}/>
                    <SortButton onFilterSelect={(selected)=>handleFilterSelect(selected, 'No. Events')} title='No. Events' content={['all','1-5','5-10','more than 10']}/>
                </div>

                <div className="group-list-container">
                    {filteredGroups.map((group: GroupDetailWithEvents) => (
                        <GroupHorizontalCard
                            key={group.id}
                            name={group.name}
                            img={group.profileImagePath}
                            hostName={group.host.name}
                            description={group.description}
                            memberSize={group.members.length}
                            id={group.id}
                        />
                    ))}
                </div>

            </div>
        </>
    );
};

export default AllGroupsPage;
