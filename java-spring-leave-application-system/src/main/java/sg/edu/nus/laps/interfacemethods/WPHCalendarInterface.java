package sg.edu.nus.laps.interfacemethods;

import sg.edu.nus.laps.model.Leave.WPHCalendar;

import java.time.LocalDate;
import java.util.List;

public interface WPHCalendarInterface {
    public List<WPHCalendar> SearchAllWPHCalendar();
    public boolean modifyWPHCalendar(boolean isHoliday, LocalDate date);
    public WPHCalendar GetWPHCalendar(LocalDate targetdate);
    public long getNumberOfWPHDays(LocalDate startDate, LocalDate endDate) ;
    public long LeavePeriods(LocalDate startDate, LocalDate endDate);
    public List<LocalDate> FindAllCalanders();

}
