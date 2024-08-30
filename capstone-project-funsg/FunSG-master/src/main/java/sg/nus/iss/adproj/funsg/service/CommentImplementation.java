package sg.nus.iss.adproj.funsg.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sg.nus.iss.adproj.funsg.interfacemethods.CommentInterface;
import sg.nus.iss.adproj.funsg.model.entity.Comment;
import sg.nus.iss.adproj.funsg.model.entity.Group;
import sg.nus.iss.adproj.funsg.repository.CommentRepository;
import sg.nus.iss.adproj.funsg.repository.GroupRepository;

import java.util.List;

@Service
@Transactional
public class CommentImplementation implements CommentInterface {
    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private GroupRepository groupRepo;

    @Override
    public List<Comment> findByGroupId(Long groupId) {
        Group group = groupRepo.findById(groupId).orElse(null);
        if (group == null) {
            return null;
        }
        return commentRepo.findByGroup(group);
    }

    @Override
    public Comment saveComment(Comment comment) {
        return commentRepo.save(comment);
    }
}
