package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.LeaveBalanceInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Enums.StaffDesignation;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.repository.LeaveBalanceRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class LeaveBalanceImplementation implements LeaveBalanceInterface {
    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    @Override
    @Transactional(readOnly = false)
    public void addNewLeaveTypeBalance(LeaveBalance leaveBalance) {
        leaveBalanceRepository.save(leaveBalance);
    }

    public List<LeaveBalance> getLeaveBalanceByStaffId(Integer id, Integer currYear) {
        return leaveBalanceRepository.findLeaveBalanceByStaffId(id);
    }

    @Override
    public LeaveBalance getLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode) {
        return leaveBalanceRepository.findLeaveBalanceByStaffIdByLeaveCode(id, leaveCode);
    }

    @Override
    @Transactional(readOnly = false)
    public void deleteLeaveTypeBalance(int balanceId) {
        leaveBalanceRepository.deleteById(balanceId);
    }

    @Override
    @Transactional
    public List<LeaveBalance> searchLeaveBalanceByLeaveType(LeaveType leaveType) {
        return leaveBalanceRepository.findByLeaveType(leaveType);
    }

    @Override
    @Transactional(readOnly = false)
    public int updateForwardLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode, Double newBalance) {
        return leaveBalanceRepository.updateForwardLeaveBalanceByStaffId(id, leaveCode, newBalance);
    }

    @Override
    @Transactional(readOnly = false)
    public int updateCurrentLeaveBalanceByStaffIdByLeaveCode(Integer id, Integer leaveCode, Double deduction) {
        return leaveBalanceRepository.updateCurrentLeaveBalanceByStaffId(id, leaveCode, deduction);
    }

    @Override
    public List<LeaveBalance> getSubordinatesLeaveBalanceInfo(int id) {
        Integer staffId = id;
        Integer currYear = LocalDate.now().getYear();

        List<LeaveBalance> leaveBalances = getLeaveBalanceByStaffId(staffId, currYear);

        LeaveBalance annualLeave = leaveBalances.stream()
                .filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode() == 1)
                .findFirst().get();

        LeaveBalance medicalLeave = leaveBalances.stream()
                .filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode() == 2)
                .findFirst().get();

        LeaveBalance compensationLeave = leaveBalances.stream()
                .filter(leaveBalance -> leaveBalance.getLeaveType().getLeaveCode() == 3)
                .findFirst().get();

        final ArrayList<LeaveBalance> staffLeaveBalance = new ArrayList();

        annualLeave.setStaff(null);
        medicalLeave.setStaff(null);
        compensationLeave.setStaff(null);
        staffLeaveBalance.add(annualLeave);
        staffLeaveBalance.add(medicalLeave);
        staffLeaveBalance.add(compensationLeave);
        return staffLeaveBalance;
    }

    @Override
    @Transactional(readOnly = false)
    public void addAllNewLeaveTypeBalance(List<Staff> stafflist,LeaveType leavetype){
        for(int i = 0;i<stafflist.size();i++){
            LeaveBalance leaveBalance1 = new LeaveBalance();
            leaveBalance1.setStaff(stafflist.get(i));
            leaveBalance1.setLeaveType(leavetype);
            leaveBalance1.setForwardBalance(0);
            if(stafflist.get(i).getDesignation()== StaffDesignation.Administrative){
                leaveBalance1.setCurrentBalance(leavetype.getAdministrativeInitBalance());
            }
            else if(stafflist.get(i).getDesignation()==StaffDesignation.Professional){
                leaveBalance1.setCurrentBalance(leavetype.getProfessionalInitBalance());
            }
            addNewLeaveTypeBalance(leaveBalance1);
        }
    }

    @Override
    @Transactional(readOnly = false)
    public void modifyLeaveBalance(LeaveType leaveTypeForUpdate,double changeAdmin,double changePro){
        List<LeaveBalance> balanceList=leaveBalanceRepository.findByLeaveType(leaveTypeForUpdate);
        for(LeaveBalance leaveBalance:balanceList){
            if(leaveBalance.getStaff().getDesignation()==StaffDesignation.Administrative){
                if(leaveBalance.getCurrentBalance()+changeAdmin>0){
                    leaveBalance.setCurrentBalance(leaveBalance.getCurrentBalance()+changeAdmin);
                }
                else{
                    leaveBalance.setCurrentBalance(0);
                }
            }
            else if(leaveBalance.getStaff().getDesignation()==StaffDesignation.Professional){
                if(leaveBalance.getCurrentBalance()+changePro>0){
                    leaveBalance.setCurrentBalance(leaveBalance.getCurrentBalance()+changePro);
                }
                else{
                    leaveBalance.setCurrentBalance(0);
                }
            }
        }
        leaveBalanceRepository.saveAll(balanceList);
    }
}
