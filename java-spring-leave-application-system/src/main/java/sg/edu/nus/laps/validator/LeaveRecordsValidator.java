package sg.edu.nus.laps.validator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import sg.edu.nus.laps.interfacemethods.WPHCalendarInterface;
import sg.edu.nus.laps.model.Employee.Staff;
import sg.edu.nus.laps.model.Leave.WPHCalendar;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveRecords;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.service.WPHCalendarImplementation;

import java.time.LocalDate;
import java.util.List;

@Component
public class LeaveRecordsValidator implements Validator {

    @Autowired
    WPHCalendarInterface wphCalendarService;
    @Autowired
    public void setLeaveRecordService(WPHCalendarImplementation wphCalendarImplementation) {
        this.wphCalendarService= wphCalendarImplementation;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return LeaveRecords.class.isAssignableFrom(clazz);
    }
    @Override
    public void validate(Object target, Errors errors) {
        LeaveRecords record = (LeaveRecords) target;

        LeaveType leaveType = record.getLeaveType();
        LocalDate startDate = record.getStartDate();
        LocalDate endDate=record.getEndDate();
        String reason = record.getReason();

        Staff staff = record.getStaff();

        List<LocalDate> calanders_date = wphCalendarService.FindAllCalanders();

        List<LeaveBalance> balances = staff.getLeaveBalance();
        LeaveBalance leaveBalance = new LeaveBalance();

        List<LeaveRecords> staff_leaveRecords = record.getStaff().getLeaveRecords();

        String dissenmination =  record.getWorkDissenmination();

        for(LeaveBalance balance : balances) {
            if(balance.getLeaveType().equals(leaveType))
                leaveBalance = balance;
        }
        if(startDate==null||endDate==null||reason==null){
            if(startDate==null){
                errors.rejectValue("startDate", "error.startDate","Please provide a start date");
            }
            if(endDate==null){
                errors.rejectValue("endDate", "error.endDate","Please provide a end date");
            }
            if(reason==""){
                errors.rejectValue("reason", "error.reason","Please provide a reason");
            }
        }

        if(startDate!=null && endDate!=null){
            if(startDate.isBefore(LocalDate.now())){
                errors.rejectValue("startDate", "error.startDate","Please provide a valid start date");
            }else if(calanders_date.contains(startDate)){
                errors.rejectValue("startDate", "error.startDate","Please select a workday");
            }else if(calanders_date.contains(endDate)){
                errors.rejectValue("endDate", "error.endDate","Please select a workday");
            }else if(endDate.isBefore(startDate)){
                errors.rejectValue("endDate","error.endDate","The end date cannot be before the start date");
            }

            for(LeaveRecords staff_leaveRecord : staff_leaveRecords) {
                if(!(startDate.isAfter(staff_leaveRecord.getEndDate())||endDate.isBefore(staff_leaveRecord.getStartDate()))){
                    errors.rejectValue("endDate","error.endDate","The leave record overlap with other records");
                    break;
                }
            }

            if(leaveType.getLeaveType().equals("compensation") ){
                if(!startDate.equals(endDate)){
                    errors.rejectValue("endDate","error.endDate","Please choose the same date as the start date");
                }else if(leaveBalance.getCurrentBalance()<0.5){
                    errors.rejectValue("endDate","error.endDate","Leave balance is not enough");
                }
                if(dissenmination==""){
                    errors.rejectValue("workDissenmination","error.dissenmination","Please indicate whether you are leaving in the morning or afternoon");
                }else if(!(dissenmination.equalsIgnoreCase("morning")||dissenmination.equals("afternoon"))){
                    errors.rejectValue("workDissenmination","error.dissenmination","Please indicate whether you are leaving in the morning or afternoon");
                }
            }

            if(leaveBalance.getForwardBalance()+leaveBalance.getCurrentBalance()<wphCalendarService.LeavePeriods(startDate,endDate))
                errors.rejectValue("endDate","error.endDate","Leave balance is not enough");

        }











    }
}
