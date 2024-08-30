package sg.edu.nus.laps.validator;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import sg.edu.nus.laps.model.Leave.CompensationRecord;

import java.time.LocalDate;

@Component
public class CompensationRecordValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return CompensationRecord.class.isAssignableFrom(clazz);
    }
    @Override
    public void validate(Object target, Errors errors) {
        CompensationRecord record = (CompensationRecord) target;
        LocalDate date = record.getOvertimeDate();
        int overtimeHours = record.getOvertimeHours();
        String reason = record.getReason();
        if(date==null){
            errors.rejectValue("overtimeDate", "error.overtimeDate", "Please provide a overtime Date");
        }
        else{
            if(date.isAfter(LocalDate.now()) || date.isEqual(LocalDate.now())) {
                errors.rejectValue("overtimeDate", "error.overtimeDate", "Please enter a valid overtime Date");
            }
        }


        if(overtimeHours<=0){
            errors.rejectValue("overtimeHours", "error.overtimeHours", "Please enter a valid overtime hours");

        } else if(overtimeHours<=3){
            errors.rejectValue("overtimeHours", "error.overtimeHours", "Overtime hours must be greater than 3 hours");
        }

        if(reason==""){
            errors.rejectValue("reason", "error.reason", "Please provide a reason");
        }
    }
}
