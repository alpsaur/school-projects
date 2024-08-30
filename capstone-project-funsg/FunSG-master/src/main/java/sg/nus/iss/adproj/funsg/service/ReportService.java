package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sg.nus.iss.adproj.funsg.model.entity.MonthlyReport;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.utils.DtoConverter;
import sg.nus.iss.adproj.funsg.repository.EventRepository;
import sg.nus.iss.adproj.funsg.repository.GroupRepository;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
public class ReportService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private EventRepository eventRepository;

    public MonthlyReport generateMonthlyReport(int year, int month){

        // Calculate the start and end dates for the specified month
        YearMonth selectedYearMonth = YearMonth.of(year, month);
        LocalDateTime currentMonthStart = selectedYearMonth.atDay(1).atStartOfDay();
        LocalDateTime currentMonthEnd = selectedYearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        // Calculate the start and end dates for the previous month
        YearMonth previousMonth = selectedYearMonth.minusMonths(1);
        LocalDateTime lastMonthStart = previousMonth.atDay(1).atStartOfDay();
        LocalDateTime lastMonthEnd = previousMonth.atEndOfMonth().atTime(LocalTime.MAX);

        //Fetch data for the specific month
        List<User> usersThisMonth = userRepository.findByCreatedAtBetween(currentMonthStart,currentMonthEnd);
        List<User> usersLastMonth = userRepository.findByCreatedAtBetween(lastMonthStart,lastMonthEnd);
        List<Group> groupsThisMonth = groupRepository.findByCreatedAtBetween(currentMonthStart,currentMonthEnd);
        List<Group> groupsLastMonth = groupRepository.findByCreatedAtBetween(lastMonthStart,lastMonthEnd);
        List<Event> eventsThisMonth = eventRepository.findByCreatedAtBetween(currentMonthStart,currentMonthEnd);
        List<Event> eventsLastMonth = eventRepository.findByCreatedAtBetween(lastMonthStart,lastMonthEnd);

        float userGrowth;
        if (usersLastMonth.isEmpty()) {
            userGrowth = usersThisMonth.isEmpty() ? 0 : 100;
        } else {
            userGrowth = Math.round(((float) usersThisMonth.size() - usersLastMonth.size()) / usersLastMonth.size() * 100 * 100) / 100f;
        }

        if (usersThisMonth.size() - usersLastMonth.size() == 0) {
            userGrowth = 0;
        }

        float groupGrowth;
        if (groupsLastMonth.isEmpty()) {
            groupGrowth = groupsThisMonth.isEmpty() ? 0 : 100;
        } else {
            groupGrowth = Math.round(((float) groupsThisMonth.size() - groupsLastMonth.size()) / groupsLastMonth.size() * 100 * 100) / 100f;
        }

        if (groupsThisMonth.size() - groupsLastMonth.size() == 0) {
            groupGrowth = 0;
        }

        float eventGrowth;
        if (eventsLastMonth.isEmpty()) {
            eventGrowth = eventsThisMonth.isEmpty() ? 0 : 100;
        } else {
            eventGrowth = Math.round(((float) eventsThisMonth.size() - eventsLastMonth.size()) / eventsLastMonth.size() * 100 * 100) / 100f;
        }

        if (eventsThisMonth.size() - eventsLastMonth.size() == 0) {
            eventGrowth = 0;
        }


        return MonthlyReport.builder()
                .newUsersThisMonth(usersThisMonth.size())
                .newGroupsThisMonth(groupsThisMonth.size())
                .newEventsThisMonth(eventsThisMonth.size())
                .newUsers(usersThisMonth.stream().map(DtoConverter::convertToUserProfileResponse).toList())
                .newGroups(groupsThisMonth.stream().map(DtoConverter::convertToAdminGroupResponse).toList())
                .newEvents(eventsThisMonth.stream().map(DtoConverter::convertToEventInfoResponse).toList())
                .userGrowth(userGrowth)
                .groupGrowth(groupGrowth)
                .eventGrowth(eventGrowth)
                .build();
    }
}
