package sg.nus.iss.adproj.funsg.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class MonthlyReportRecord {
    public static final String[] CSV_HEADER = {"Type", "ID", "Name", "Description", "Location", "Start Date", "End Date", "Group ID", "Group Name","Created At"};
    public static final String[] CSV_NAME_MAPPING = {"type", "id", "name", "description", "location", "startDate", "endDate", "groupId", "groupName","createdAt"};

    private String type;
    private Long id;
    private String name;
    private String description;
    private String location;
    private String startDate;
    private String endDate;
    private Long groupId;
    private String groupName;
    private LocalDateTime createdAt;


}

