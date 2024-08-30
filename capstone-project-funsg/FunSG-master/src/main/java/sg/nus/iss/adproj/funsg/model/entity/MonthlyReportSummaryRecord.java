package sg.nus.iss.adproj.funsg.model.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthlyReportSummaryRecord {

    public static final String[] CSV_HEADER = {"Metric", "Value"};
    public static final String[] CSV_NAME_MAPPING = {"metric", "value"};

    private String metric;
    private String value;

    public static MonthlyReportSummaryRecord of(String metric, String value) {
        MonthlyReportSummaryRecord record = new MonthlyReportSummaryRecord();
        record.metric = metric;
        record.value = value;
        return record;
    }
}
