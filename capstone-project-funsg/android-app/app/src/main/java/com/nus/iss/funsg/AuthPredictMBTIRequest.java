package com.nus.iss.funsg;

import java.util.List;

public class AuthPredictMBTIRequest {
    List<String> userInputs;

    public AuthPredictMBTIRequest(List<String> userInputs) {
        this.userInputs = userInputs;
    }

    public List<String> getUserInputs() {
        return userInputs;
    }

    public void setUserInputs(List<String> userInputs) {
        this.userInputs = userInputs;
    }
}
