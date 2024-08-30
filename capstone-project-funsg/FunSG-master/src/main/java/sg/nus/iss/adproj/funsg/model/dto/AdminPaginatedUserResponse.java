package sg.nus.iss.adproj.funsg.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class AdminPaginatedUserResponse {
    private List<AdminUserResponse> users;
    private int totalPages;
    private long totalElements;
    private int size;
    private int number;
}
