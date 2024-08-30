package sg.edu.nus.laps;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import sg.edu.nus.laps.service.CalendarService;
@Component
public class StartupDataLoader {
    private final CalendarService calendarService;

    @Autowired
    public StartupDataLoader(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        calendarService.loadCalendarData();
    }
}
