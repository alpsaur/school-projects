package sg.edu.nus.laps;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import sg.edu.nus.laps.model.Employee.Admin;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Employee.User;
import sg.edu.nus.laps.model.Enums.ApplicationStatus;
import sg.edu.nus.laps.model.Enums.LeaveGranularity;
import sg.edu.nus.laps.model.Leave.CompensationRecord;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.repository.*;

import java.time.LocalDate;
import java.util.Date;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static sg.edu.nus.laps.model.Enums.StaffDesignation.*;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

public class RepositoryTests {
    @Autowired
    private UserRepository userrepo;
    @Autowired
    private LeaveTypeRepository leaverepo;
    @Autowired
    private LeaveRecordsRepository leaverecordsrepo;
    @Autowired
    private CompensationRecordRepository compensationrecordrepo;
    @Autowired
    private LeaveBalanceRepository leavebalancerepo;
    @Test
    public void testSaveEntity(){
        //staff and admin
        /*
        Staff staff1 = new Staff();
        staff1.setPassword("abc123");
        staff1.setUsername("jack001");
        staff1.setDesignation(Professional);
        staff1.setEmail("jack001@gmail.com");
        staff1.setFirstName("Jack");
        staff1.setLastName("Smith");
        staff1.setPhoneNumber("1321471");
        userrepo.save(staff1);

        Staff staff2 = new Staff();
        staff2.setPassword("abc123");
        staff2.setUsername("rose001");
        staff2.setDesignation(Administrative);
        staff2.setEmail("rose001@gmail.com");
        staff2.setFirstName("Rose");
        staff2.setLastName("Seller");
        staff2.setPhoneNumber("1241532");
        userrepo.save(staff2);

        Admin admin1 = new Admin();
        admin1.setPassword("admin123");
        admin1.setUsername("admin001");
        userrepo.save(admin1);
*/
        //3 leave type
        LeaveType leaveType1 = new LeaveType();
        //leaveType1.setLeavecode(1);
        leaveType1.setLeaveType("annual");
        leaveType1.setGranularity(LeaveGranularity.ONE);
        leaverepo.save(leaveType1);
        LeaveType leaveType2 = new LeaveType();
        //leaveType2.setLeavecode(2);
        leaveType2.setLeaveType("medical");
        leaveType2.setGranularity(LeaveGranularity.ONE);
        leaverepo.save(leaveType2);
        LeaveType leaveType3 = new LeaveType();
        //leaveType3.setLeavecode(3);
        leaveType3.setLeaveType("compensation");
        leaveType3.setGranularity(LeaveGranularity.HALF);
        leaverepo.save(leaveType3);

        //leave balance
        /*
        LeaveBalance leaveBalance1 = new LeaveBalance();
        leaveBalance1.setStaff(staff1);
        leaveBalance1.setLeaveType(leaveType1);
        leaveBalance1.setForwardBalance(2.5);
        leaveBalance1.setCurrentBalance(21.0);
        leaveBalance1.setInYear(2024);
        leavebalancerepo.save(leaveBalance1);

        LeaveBalance leaveBalance2 = new LeaveBalance();
        leaveBalance2.setStaff(staff1);
        leaveBalance2.setLeaveType(leaveType2);
        leaveBalance2.setForwardBalance(0);
        leaveBalance2.setCurrentBalance(60.0);
        leaveBalance2.setInYear(2024);
        leavebalancerepo.save(leaveBalance2);

        LeaveBalance leaveBalance3 = new LeaveBalance();
        leaveBalance3.setStaff(staff1);
        leaveBalance3.setLeaveType(leaveType3);
        leaveBalance3.setForwardBalance(0);
        leaveBalance3.setCurrentBalance(1.5);
        leaveBalance3.setInYear(2024);
        leavebalancerepo.save(leaveBalance3);

        LeaveBalance leaveBalance4 = new LeaveBalance();
        leaveBalance1.setStaff(staff2);
        leaveBalance1.setLeaveType(leaveType1);
        leaveBalance1.setForwardBalance(3.5);
        leaveBalance1.setCurrentBalance(30.0);
        leaveBalance1.setInYear(2024);
        leavebalancerepo.save(leaveBalance4);

        LeaveBalance leaveBalance5 = new LeaveBalance();
        leaveBalance2.setStaff(staff2);
        leaveBalance2.setLeaveType(leaveType2);
        leaveBalance2.setForwardBalance(0);
        leaveBalance2.setCurrentBalance(50.0);
        leaveBalance2.setInYear(2024);
        leavebalancerepo.save(leaveBalance5);

        LeaveBalance leaveBalance6 = new LeaveBalance();
        leaveBalance3.setStaff(staff2);
        leaveBalance3.setLeaveType(leaveType3);
        leaveBalance3.setForwardBalance(0);
        leaveBalance3.setCurrentBalance(0.5);
        leaveBalance3.setInYear(2024);
        leavebalancerepo.save(leaveBalance6);


        //leave record
        LeaveRecords leaveRecords1 = new LeaveRecords();
        leaveRecords1.setStaff(staff1);
        leaveRecords1.setLeaveType(leaveType1);
        leaveRecords1.setStatus(ApplicationStatus.applied);
        leaveRecords1.setReason("travel");
        LocalDate date1 = LocalDate.of(2024,10,2);
        leaveRecords1.setStartDate(date1);
        LocalDate date2 = LocalDate.of(2024,10,22);
        leaveRecords1.setEndDate(date2);
        leaverecordsrepo.save(leaveRecords1);

        //compensation record
        CompensationRecord compenRecord1 = new CompensationRecord();
        compenRecord1.setStaff(staff1);
        compenRecord1.setOvertimeHours(4);
        compenRecord1.setStatus(ApplicationStatus.approved);
        compenRecord1.setReason("rest");
        compenRecord1.setComment("OK,Approved");
        LocalDate date3 = LocalDate.of(2024,9,22);
        compenRecord1.setClaimDate(date3);
        compensationrecordrepo.save(compenRecord1);


        User found = userrepo.findById(staff1.getId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getUsername()).isEqualTo("jack001");

        */
    }

}
