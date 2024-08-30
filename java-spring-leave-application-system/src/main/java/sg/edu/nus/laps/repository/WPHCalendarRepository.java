package sg.edu.nus.laps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sg.edu.nus.laps.model.Leave.WPHCalendar;

import java.time.LocalDate;
import java.util.List;

public interface WPHCalendarRepository extends JpaRepository<WPHCalendar, Long> {
    @Modifying
    @Query("update WPHCalendar wphc set wphc.isHoliday = :res where wphc.weekendPublicHoliday=:date")
    public void updateHoliday(@Param("res") boolean res, @Param("date") LocalDate date);

    @Query("select wphc from WPHCalendar wphc where wphc.weekendPublicHoliday = :targetdate")
    public WPHCalendar getHoliday(@Param("targetdate") LocalDate targetdate);

    @Query("SELECT COUNT(w) FROM WPHCalendar w WHERE (w.weekendPublicHoliday >= :startDate AND w.weekendPublicHoliday <= :endDate) AND (w.isWeekend=true OR w.isHoliday=true)")
    long getNumberOfWPHDays(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("select wphc from WPHCalendar wphc where wphc.isWeekend=true OR wphc.isHoliday=true")
    List<WPHCalendar> getHolidays();
}
