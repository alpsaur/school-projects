package sg.edu.nus.laps.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.interfacemethods.LeaveTypeInterface;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.repository.LeaveTypeRepository;

import java.util.List;

@Service
@Transactional
public class LeaveTypeImplementation implements LeaveTypeInterface {
    @Autowired
    LeaveTypeRepository leaveTypeRepository;

    @Override
    @Transactional
    public List<LeaveType> SearchAllLeaveType(){
        return leaveTypeRepository.findAll();
    }

    @Override
    @Transactional(readOnly = false)
    public LeaveType addnewLeaveType(LeaveType leaveType){
        return leaveTypeRepository.save(leaveType);
    }
    @Override
    @Transactional(readOnly = false)
    public void deleteLeaveType(int id){
        leaveTypeRepository.deleteById(id);
    }
    @Override
    @Transactional
    public int SearchLeaveCodeMax(){
        return leaveTypeRepository.getMaxLeaveCode();
    }
    @Override
    @Transactional
    public LeaveType SearchLeaveType(int id){
        return leaveTypeRepository.findById(id).get();
    };
}
