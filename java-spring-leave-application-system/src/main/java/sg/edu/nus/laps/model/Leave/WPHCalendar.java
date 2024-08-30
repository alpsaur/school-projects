package sg.edu.nus.laps.model.Leave;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table
public class WPHCalendar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean isHoliday;
    private boolean isWeekend;
    private LocalDate weekendPublicHoliday;
    private String description;

    public LocalDate getWeekendPublicHoliday() {
        return weekendPublicHoliday;
    }

    public void setWeekendPublicHoliday(LocalDate weekendPublicHoliday) {
        this.weekendPublicHoliday = weekendPublicHoliday;
    }

    public boolean isHoliday() {
        return isHoliday;
    }
    public void setHoliday(boolean holiday) {
        isHoliday = holiday;
    }

    public boolean isWeekend() {
        return isWeekend;
    }

    public void setWeekend(boolean weekend) {
        isWeekend = weekend;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
