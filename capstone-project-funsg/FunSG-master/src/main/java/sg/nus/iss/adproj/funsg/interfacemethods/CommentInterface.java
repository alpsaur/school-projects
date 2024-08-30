package sg.nus.iss.adproj.funsg.interfacemethods;

import sg.nus.iss.adproj.funsg.model.entity.Comment;

import java.util.List;

public interface CommentInterface {
    List<Comment> findByGroupId(Long groupId);

    Comment saveComment(Comment comment);
}
