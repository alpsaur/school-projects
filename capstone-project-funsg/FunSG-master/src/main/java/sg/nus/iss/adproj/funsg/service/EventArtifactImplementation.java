package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.EventArtifactInterface;
import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.EventArtifact;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.repository.EventArtifactRepository;

import java.util.List;

@Service
@Transactional
public class EventArtifactImplementation implements EventArtifactInterface {
    @Autowired
    private EventArtifactRepository eventArtifactRepo;

    @Override
    public EventArtifact saveEventArtifact(EventArtifact artifact) {

        return eventArtifactRepo.save(artifact);
    }

    @Override
    public List<String> getEventsFilePathByGroup(Group group) {
        return eventArtifactRepo.findFilePathByGroup(group);
    }

    @Override
    public List<String> getEventsFilePathByEvent(Event event) {
        return eventArtifactRepo.findFilePathByEvent(event);
    }

}
