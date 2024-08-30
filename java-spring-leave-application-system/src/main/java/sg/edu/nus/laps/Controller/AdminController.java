package sg.edu.nus.laps.Controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import sg.edu.nus.laps.interfacemethods.LeaveBalanceInterface;
import sg.edu.nus.laps.interfacemethods.LeaveTypeInterface;
import sg.edu.nus.laps.interfacemethods.WPHCalendarInterface;
import sg.edu.nus.laps.model.Employee.Manager;
import sg.edu.nus.laps.model.Employee.StaffState;
import sg.edu.nus.laps.model.Enums.StaffDesignation;
import sg.edu.nus.laps.model.Leave.LeaveBalance;
import sg.edu.nus.laps.model.Leave.LeaveType;
import sg.edu.nus.laps.model.Leave.WPHCalendar;
import sg.edu.nus.laps.service.*;
import org.springframework.ui.Model;
import sg.edu.nus.laps.model.Employee.Staff;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping(value = "/admin")
public class AdminController {

    @Autowired
    GetStaffImplementation getStaffService;
    @Autowired
    StaffEditImplementation staffEditService;

    @Autowired
    private WPHCalendarInterface WPHCservice;//calendar
    @Autowired
    private LeaveTypeInterface leaveTypeservice;//leavetype
    @Autowired
    private LeaveBalanceInterface leaveBalanceService;

    @Autowired
    public void setWPHCService(WPHCalendarImplementation WPHCserviceImpl) {
        this.WPHCservice = WPHCserviceImpl;
    }

    @Autowired
    public void setLeaveTypeService(LeaveTypeImplementation leaveTypeserviceImpl) {
        this.leaveTypeservice = leaveTypeserviceImpl;
    }
    @Autowired
    public void setLeaveBalanceService(LeaveBalanceImplementation leaveBalanceServiceImpl) {
        this.leaveBalanceService = leaveBalanceServiceImpl;
    }

    @GetMapping("/viewCalendar")
    public String viewCalendar(@RequestParam(value = "date",required = false) String date,Model model) {
        List<WPHCalendar> wphCalendarList= WPHCservice.SearchAllWPHCalendar();
        List<WPHCalendar> weekendList = wphCalendarList.stream().filter(WPHCalendar::isWeekend).toList();
        List<WPHCalendar> holidayList = wphCalendarList.stream().filter(WPHCalendar::isHoliday).toList();
        model.addAttribute("weekendList", weekendList);
        model.addAttribute("holidayList", holidayList);

        if(date!=null) {
            String month = date.substring(0, 2);
            String day = date.substring(3, 5);
            String year = date.substring(6, 10);
            date = year + "-" + month + "-" + day;
            LocalDate localDate = LocalDate.parse(date);
            WPHCalendar wphCalendarres = WPHCservice.GetWPHCalendar(localDate);
            model.addAttribute("targetdate", wphCalendarres);
        }
        return "view-Calendar";
    }

    @GetMapping("/setHoliday")
    public String setHoliday(@RequestParam(value = "date",required = false) String date,
                             @RequestParam(value = "set") boolean set, Model model) {
        if(date.isEmpty()){
            return "redirect:/admin/viewCalendar";
        }
        if(set){
            String month = date.substring(0, 2);
            String day = date.substring(3, 5);
            String year = date.substring(6, 10);
            date = year + "-" + month + "-" + day;
        }
        LocalDate localDate = LocalDate.parse(date);
        boolean result = WPHCservice.modifyWPHCalendar(set,localDate);
        return "redirect:/admin/viewCalendar";
    }

    @GetMapping("/viewLeaveType")
    public String viewLeaveType(Model model) {
        List<LeaveType> leaveTypes = leaveTypeservice.SearchAllLeaveType();
        model.addAttribute("leaveTypes", leaveTypes);

        LeaveType leaveTypeForUpdate = new LeaveType();
        model.addAttribute("leaveTypeForUpdate", leaveTypeForUpdate);

        return "view-LeaveType";
    }

    @GetMapping("/createNewType")
    public String createNewType(Model model) {
        LeaveType leavetype = new LeaveType();
        model.addAttribute("leavetype", leavetype);
        return "create-LeaveType";
    }

    @PostMapping("/addNewLeaveType")
    public String addNewLeaveType(@ModelAttribute("leavetype") LeaveType leavetype,
                                  Model model) {
        try{
            leaveTypeservice.addnewLeaveType(leavetype);
        }
        catch(Exception e){}
        //add new balance


        List<Staff> stafflist =  getStaffService.findAllStaff();
        leaveBalanceService.addAllNewLeaveTypeBalance(stafflist,leavetype);
        return "redirect:/admin/viewLeaveType";
    }

    @PostMapping("/modifyLeaveType")
    public String modifyLeaveType(@ModelAttribute("leaveTypeForUpdate") LeaveType inLeaveType){
        LeaveType leaveTypeForUpdate = leaveTypeservice.SearchLeaveType(inLeaveType.getLeaveCode());

        double changeAdmin = inLeaveType.getAdministrativeInitBalance()-leaveTypeForUpdate.getAdministrativeInitBalance();
        double changePro = inLeaveType.getProfessionalInitBalance()-leaveTypeForUpdate.getProfessionalInitBalance();

        leaveTypeForUpdate.setAdministrativeInitBalance(inLeaveType.getAdministrativeInitBalance());
        leaveTypeForUpdate.setProfessionalInitBalance(inLeaveType.getProfessionalInitBalance());
        leaveTypeservice.addnewLeaveType(leaveTypeForUpdate);
        leaveBalanceService.modifyLeaveBalance(leaveTypeForUpdate,changeAdmin,changePro);
        return "redirect:/admin/viewLeaveType";
    }
    @GetMapping("/deleteLeaveType")
    public String deleteLeaveType(@RequestParam(value = "id") int id) {

        if (id != 1 && id != 2 && id != 3) {
            //delete the balance in leave type balance first
            List<LeaveBalance> leavebalancetodelete= leaveBalanceService.searchLeaveBalanceByLeaveType(leaveTypeservice.SearchLeaveType(id));


            for(LeaveBalance leaveBalance:leavebalancetodelete){
                leaveBalanceService.deleteLeaveTypeBalance(leaveBalance.getId());
            }
            leaveTypeservice.deleteLeaveType(id);
        }

        return "redirect:/admin/viewLeaveType";
    }

    @GetMapping(value = "/displayStaff")
    public String displayStaff(Model model) {
        List<Staff> staffList = getStaffService.findAllStaff();
        model.addAttribute("staffList", staffList);
        return "displayStaff";
    }

    @PostMapping(value = "/searchStaff")
    public String searchStaff(@ModelAttribute("searchStr") String searchStr, Model model) {
        List<Staff> staffList = getStaffService.findByStr(searchStr);
        model.addAttribute("staffList", staffList);
        return "displayStaff";
    }

    @GetMapping(value = "/createStaff")
    public String createStaff(Model model) {
        model.addAttribute("staff", new Staff());
        return "staffBasicInfo";
    }

    @PostMapping(value = "/deleteStaff")
    public String deleteStaff(@RequestParam("id") int id) {
        Staff staff = getStaffService.findStaffById(id);
        staffEditService.deleteStaff(staff);
        return "redirect:/admin/displayStaff";
    }

    @GetMapping(value = "/staffBasicInfo")
    public String staffBasicDetails(@RequestParam("id") int id, Model model) {
        Staff staff = getStaffService.findStaffById(id);
        model.addAttribute("staff", staff);
        return "staffBasicInfo";
    }

    @PostMapping(value = "/saveNewStaff")
    public String saveNewStaff(@Valid @ModelAttribute("staff") Staff staff,
                               BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            // If there are validation errors, return to the form page and display error info
            model.addAttribute("staff", staff);
        } else {
            //no validation errors, save new staff
            Staff newStaff = staffEditService.saveNewStaff(staff);
            model.addAttribute("staff", newStaff);
        }
        return "staffBasicInfo";
    }

    @PostMapping(value = "/editStaffBasic")
    public String editStaff(@Valid @ModelAttribute("staff") Staff staff,
                            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            // If there are validation errors, return to the form page and display error info
            model.addAttribute("staff", staff);
        } else {
            //no validation errors, save staff info
            Staff newStaff = staffEditService.editStaffBasics(staff);
            model.addAttribute("staff", newStaff);
        }
        return "staffBasicInfo";
    }

    @GetMapping(value = "/staffAdvancedDetails")
    public String staffAdvancedDetails(@RequestParam("id") int id, Model model) {
        Staff staff = getStaffService.findStaffById(id);
        StaffState staffState = new StaffState(staff);
        model.addAttribute("staffState", staffState);
        return "staffAdvancedDetails";
    }

    @PostMapping(value = "/changeRole")
    public String changeRole(@ModelAttribute("staffState") StaffState staffState, Model model) {
        Staff staff = staffEditService.saveRole(staffState);
        return "redirect:/admin/staffAdvancedDetails?id=" + staff.getId();
    }
    @PostMapping(value = "/saveAdmin")
    public String saveAdmin(@ModelAttribute("staffState") StaffState staffState, Model model) {
        Staff staff = staffEditService.saveAdmin(staffState);
        return "redirect:/admin/staffAdvancedDetails?id=" + staff.getId();
    }

    @PostMapping(value = "/saveLeaveBalance")
    public String saveLeaveBalance(@ModelAttribute("staffState")StaffState staffState, Model model) {
        Staff staff = staffState.getStaff();
        Staff updatedstaff = staffEditService.saveLeaveBalance(staff);
        return "redirect:/admin/staffAdvancedDetails?id=" + updatedstaff.getId();
    }

    @PostMapping(value = "/deleteSubordinate")
    public String deleteSubordinate(@RequestParam("id") int id) {
        Staff staff = getStaffService.findStaffById(id);
        Manager manager = staff.getManagedBy();
        staffEditService.dissolveManagedBy(staff);
        return "redirect:/admin/staffAdvancedDetails?id=" + manager.getId();
    }

    @GetMapping(value = "/displayStaffWithoutManager")
    public String displayStaffWithoutManager(@RequestParam("id") int id, Model model) {
        Manager manager = (Manager) getStaffService.findStaffById(id);
        List<Staff> staffList = getStaffService.findStaffsWithoutManager();
        staffList.remove(manager.getManagedBy());
        staffList.remove(manager);
        model.addAttribute("manager", manager);
        model.addAttribute("staffList", staffList);
        return "addSubordinate";
    }

    @GetMapping(value = "/addSubordinate")
    public String addSubordinate(@RequestParam("staffId") int staffId,
                                 @RequestParam("managerId") int managerId) {
        Manager manager = (Manager)getStaffService.findStaffById(managerId);
        Staff staff = getStaffService.findStaffById(staffId);
        staffEditService.buildManagedBy(manager, staff);
        return "redirect:/admin/displayStaffWithoutManager?id=" + manager.getId();
    }


}
