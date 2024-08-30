import ListStaff from "./staff_view/components/ListStaff.jsx";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import './styles.css'
import Footer from "./components/Footer.jsx";
import StaffLeaveBalance from "./staff_view/components/StaffLeaveBalance.jsx";
import {useState} from "react";

function App() {
    const [selectedStaff, setSelectedStaff] = useState(null)

    const handleViewClicked = (staff) => {
        setSelectedStaff(staff);
    }

    return (
        <div>
            <Navbar/>
            <Header/>
            <main className="main">
                <ListStaff onViewClick={handleViewClicked}/>
                {selectedStaff && (
                    <StaffLeaveBalance staffId={selectedStaff.id}
                                       staffName={selectedStaff.firstName + " " + selectedStaff.lastName}/>)}
            </main>
            <Footer/>
        </div>
    )
}

export default App
