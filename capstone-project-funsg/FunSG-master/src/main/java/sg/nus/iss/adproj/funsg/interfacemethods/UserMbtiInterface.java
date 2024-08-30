package sg.nus.iss.adproj.funsg.interfacemethods;

import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.entity.UserMBTI;

import java.util.List;

public interface UserMbtiInterface {
    void savePrediction(User currentUser, String mbtiPrediction, String mbtiUserInputs);

    List<String> getMBTIWordsRecord(User currentUser);
}
