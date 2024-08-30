package com.nus.iss.funsg;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class GroupAdapterPageMember extends RecyclerView.Adapter<GroupAdapterPageMember.EventViewHolder>{
    private List<AuthUserProfileResponse> memberList;
    private Context context;

    public GroupAdapterPageMember(List<AuthUserProfileResponse> memberList, Context context) {
        this.memberList = new ArrayList<>(memberList);
        this.context = context;
    }
    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.member_list_group_view, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        AuthUserProfileResponse member=memberList.get(position);
        Glide.with(context).load(member.getProfileImage()).into(holder.memberImageView);
    }

    @Override
    public int getItemCount() {
        return memberList.size();
    }
    public static class EventViewHolder extends RecyclerView.ViewHolder{
        CircleImageView memberImageView;
        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            memberImageView=itemView.findViewById(R.id.member_image);
        }
    }
}
