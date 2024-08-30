package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class MbtiPredictionService {
    private final RestTemplate restTemplate;

    @Value("${ML.api.url}")
    private String mlApiUrl;

    @Value("${ML.api.key}")
    private String apiKey;

    public MbtiPredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String callMLApi(List<String> userInputs) {

        // Create the headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);

        // Create the body
        Map<String, String> body = new HashMap<>();
        body.put("words", String.join(" ", userInputs));

        // Create the entity with headers and body
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        // Make the POST request
        ResponseEntity<String> response = restTemplate.exchange(
                mlApiUrl + "/predict",
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getStatusCode() == HttpStatus.OK) {
            // Return the response body as a String

            return response.getBody();
        } else {
            throw new RuntimeException("Failed to call ML API: " + response.getStatusCode());
        }
    }

}
