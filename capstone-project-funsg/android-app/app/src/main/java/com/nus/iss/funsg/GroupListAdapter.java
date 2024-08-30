package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.graphics.Paint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class GroupListAdapter extends RecyclerView.Adapter<GroupListAdapter.GroupViewHolder>{
    private List<AuthGroupsResponse> groupsList;
    private Context context;
    public GroupListAdapter(Context context, List<AuthGroupsResponse> groupsList) {
        this.context = context;
        this.groupsList = new ArrayList<>(groupsList);
    }

    @NonNull
    @Override
    public GroupViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.group_list_item,parent,false);
        return new GroupViewHolder(view);
    }
    @Override
    public void onBindViewHolder(@NonNull GroupViewHolder holder, int position){
        AuthGroupsResponse group = groupsList.get(position);
        holder.groupName.setText(group.getName());
        int groupMemberCount=group.getMembers().size();
        holder.groupMemberNumber.setText(String.valueOf(groupMemberCount));
        holder.groupStatus.setText(group.getStatus());
        //set underline
        holder.groupPageText.setPaintFlags(holder.groupPageText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        holder.groupEditInfoText.setPaintFlags(holder.groupEditInfoText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        holder.groupPageText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context,GroupPage.class);
                intent.putExtra("groupId",group.getId());
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return groupsList.size();
    }

    public static class GroupViewHolder extends RecyclerView.ViewHolder {
        TextView groupName;
        TextView groupMemberNumber;
        TextView groupStatus;
        TextView groupPageText;
        TextView groupEditInfoText;

        public GroupViewHolder(@NonNull View itemView) {
            super(itemView);
            groupName = itemView.findViewById(R.id.group_name);
            groupMemberNumber=itemView.findViewById(R.id.group_member_number);
            groupStatus = itemView.findViewById(R.id.group_status);
            groupPageText=itemView.findViewById(R.id.group_page_btn);
            groupEditInfoText=itemView.findViewById(R.id.group_edit_btn);
        }
    }
    public void updateGroups(List<AuthGroupsResponse> newGroupsList) {
        groupsList.clear();
        groupsList.addAll(newGroupsList);
        notifyDataSetChanged();
    }
}
