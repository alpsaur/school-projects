package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sg.edu.nus.laps.interfacemethods.WPHCalendarInterface;
import sg.edu.nus.laps.model.Leave.WPHCalendar;
import org.springframework.transaction.annotation.Transactional;
import sg.edu.nus.laps.repository.WPHCalendarRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class WPHCalendarImplementation implements WPHCalendarInterface {
    @Autowired
    private WPHCalendarRepository wphCalendarRepository;


    @Override
    @Transactional
    public List<WPHCalendar> SearchAllWPHCalendar(){
        return wphCalendarRepository.findAll();
    }

    @Override
    @Transactional
    public boolean modifyWPHCalendar(boolean isHoliday, LocalDate date){
        wphCalendarRepository.updateHoliday(isHoliday,date);
        return true;
    }
    @Override
    @Transactional
    public WPHCalendar GetWPHCalendar(LocalDate targetdate){
        return wphCalendarRepository.getHoliday(targetdate);
    }

    @Override
    @Transactional
    public long getNumberOfWPHDays(LocalDate startDate, LocalDate endDate) {
        return wphCalendarRepository.getNumberOfWPHDays(startDate, endDate);

    }

    @Transactional
    @Override
    public long LeavePeriods(LocalDate startDate, LocalDate endDate){
        long totalDays = ChronoUnit.DAYS.between(startDate,endDate)+1;
        long daysCount =  wphCalendarRepository.getNumberOfWPHDays(startDate,endDate);
        if(totalDays <= 14){
            return totalDays-daysCount;
        }
        else {
            return totalDays;
        }
    }

    @Transactional
    @Override
    public List<LocalDate> FindAllCalanders() {
        List<WPHCalendar> calanders = wphCalendarRepository.getHolidays();
        List<LocalDate> calanderDates = new ArrayList<>();
        for (WPHCalendar calander : calanders) {
            calanderDates.add(calander.getWeekendPublicHoliday());
        }
        return calanderDates;
    }
}
