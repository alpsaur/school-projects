package com.nus.iss.funsg;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class GroupAdapterPageComment extends RecyclerView.Adapter<GroupAdapterPageComment.EventViewHolder>{
    private List<AuthGroupCommentResponse> commmentList;
    private Context context;
    public GroupAdapterPageComment(Context context,List<AuthGroupCommentResponse> commmentList) {
        this.commmentList = new ArrayList<>(commmentList);
        this.context = context;
    }
    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.group_comment_item, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        AuthGroupCommentResponse comment=commmentList.get(position);
        holder.commentContentText.setText(comment.getContent());
        holder.commentTimeText.setText(DateUtils.formatDateStringInHint(comment.getPostedAt()));
        Glide.with(context).load(comment.getUser().getProfileImage()).into(holder.userImage);
    }

    @Override
    public int getItemCount() {
        return commmentList.size();
    }
    public static class EventViewHolder extends RecyclerView.ViewHolder{
        TextView commentContentText, commentTimeText;
        CircleImageView userImage;
        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            commentContentText = itemView.findViewById(R.id.comment_content);
            commentTimeText = itemView.findViewById(R.id.comment_time);
            userImage = itemView.findViewById(R.id.user_image);
        }
    }
}
