package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class GroupAdapterForSelect extends RecyclerView.Adapter<GroupAdapterForSelect.GroupViewHolder>{
    private List<AuthGroupsResponse> groupsList;
    private Context context;
    public GroupAdapterForSelect(Context context, List<AuthGroupsResponse> groupsList) {
        this.context = context;
        this.groupsList = groupsList;
    }
    @NonNull
    @Override
    public GroupViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.group_select_list_item, parent, false);
        return new GroupViewHolder(view);
    }
    @Override
    public void onBindViewHolder(@NonNull GroupViewHolder holder, int position){
        AuthGroupsResponse group = groupsList.get(position);
        holder.groupName.setText(group.getName());
        holder.groupMembers.setText(String.valueOf(group.getMembers().size()));
        holder.groupStatus.setText(group.getStatus());
        holder.itemView.setOnClickListener(v ->{
            Intent intent = new Intent(context,CreateEvent.class);
            intent.putExtra("groupId",group.getId());
            context.startActivity(intent);
        });
    }
    @Override
    public int getItemCount() {
        return groupsList.size();
    }
    public static class GroupViewHolder extends RecyclerView.ViewHolder{
        TextView groupName, groupMembers, groupStatus;
        public GroupViewHolder(@NonNull View itemView) {
            super(itemView);
            groupName = itemView.findViewById(R.id.groupName);
            groupMembers = itemView.findViewById(R.id.members_number);
            groupStatus = itemView.findViewById(R.id.group_status);
        }
    }
}
