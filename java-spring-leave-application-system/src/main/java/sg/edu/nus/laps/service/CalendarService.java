package sg.edu.nus.laps.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import sg.edu.nus.laps.model.ApiResponse;
import sg.edu.nus.laps.model.Leave.WPHCalendar;
import sg.edu.nus.laps.repository.WPHCalendarRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class CalendarService {
    private final WebClient webClient;
    private final WPHCalendarRepository wphCalendarRepository;
    @Autowired
    public CalendarService(WebClient webClient, WPHCalendarRepository wphCalendarRepository) {
        this.webClient = webClient;
        this.wphCalendarRepository = wphCalendarRepository;
    }

    public void loadCalendarData() {
        // gain all dates 2024
        List<WPHCalendar> calendarList = new ArrayList<>();
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 12, 31);

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            WPHCalendar calendar = new WPHCalendar();
            calendar.setWeekendPublicHoliday(date);
            calendar.setWeekend(isWeekend(date));
            calendarList.add(calendar);
        }

        // gain api data
        String apiUrl = "?resource_id=d_4e19214c3a5288eab7a27235f43da4fa";

        Mono<ApiResponse> responseMono = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(ApiResponse.class);

        ApiResponse response = responseMono.block();

        if (response != null && response.getResult() != null && response.getResult().getRecords() != null) {
            List<ApiResponse.Record> records = response.getResult().getRecords();
            for (ApiResponse.Record record : records) {
                LocalDate holidayDate = LocalDate.parse(record.getDate());
                calendarList.stream()
                        .filter(calendar -> calendar.getWeekendPublicHoliday().equals(holidayDate))
                        .forEach(calendar -> calendar.setHoliday(true));
            }
        }
        // Note: Run this line of code when running the application at the first time
        // this line of code is to populate holiday
        wphCalendarRepository.saveAll(calendarList);
    }
    private boolean isWeekend(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }
}
