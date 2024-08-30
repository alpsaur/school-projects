package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.UserMbtiInterface;
import sg.nus.iss.adproj.funsg.model.entity.User;
import sg.nus.iss.adproj.funsg.model.entity.UserMBTI;
import sg.nus.iss.adproj.funsg.repository.UserMBTIRepository;
import sg.nus.iss.adproj.funsg.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserMbtiImplementation implements UserMbtiInterface {
    @Autowired
    private UserMBTIRepository userMBTIRepo;
    @Autowired
    private UserRepository userRepo;

    @Override
    public void savePrediction(User currentUser, String mbtiPrediction, String mbtiUserInputs) {
        UserMBTI userMBTI = UserMBTI.builder()
                .user(currentUser)
                .mbtiPrediction(mbtiPrediction)
                .predictedAt(LocalDateTime.now())
                .mbtiWords(mbtiUserInputs)
                .build();

        userMBTIRepo.save(userMBTI);
        List<UserMBTI> userMBTIRecords = userMBTIRepo.findByUser(currentUser);
        currentUser.setMbtiRecord(userMBTIRecords);
        userRepo.save(currentUser);
    }

    @Override
    public List<String> getMBTIWordsRecord(User currentUser) {
        return userMBTIRepo.findMBTIWordsByUser(currentUser);
    }

}
