package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class GroupAdapterForHome extends RecyclerView.Adapter<GroupAdapterForHome.EventViewHolder>{
    private List<AuthGroupsResponse> groupList;
    private Context context;

    public GroupAdapterForHome(Context context,List<AuthGroupsResponse> groupList) {
        this.groupList = groupList;
        this.context = context;
    }
    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.home_group_item, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        AuthGroupsResponse group=groupList.get(position);
        holder.groupBtn.setText(group.getName());
        holder.groupBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent =new Intent(context,GroupPage.class);
                intent.putExtra("groupId",group.getId());
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return groupList.size();
    }

    public static class EventViewHolder extends RecyclerView.ViewHolder{
        Button groupBtn;
        public EventViewHolder(@NonNull View itemView){
            super(itemView);
            groupBtn=itemView.findViewById(R.id.group_joined);
        }
    }
}
