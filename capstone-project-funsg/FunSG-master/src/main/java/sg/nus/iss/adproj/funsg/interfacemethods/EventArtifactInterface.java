package sg.nus.iss.adproj.funsg.interfacemethods;

import sg.nus.iss.adproj.funsg.model.entity.Event;
import sg.nus.iss.adproj.funsg.model.entity.EventArtifact;
import sg.nus.iss.adproj.funsg.model.entity.Group;

import java.util.List;

public interface EventArtifactInterface {
    EventArtifact saveEventArtifact(EventArtifact artifact);

    List<String> getEventsFilePathByGroup(Group group);

    List<String> getEventsFilePathByEvent(Event event);
}
