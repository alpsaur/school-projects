package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class GroupAdapter extends RecyclerView.Adapter<GroupAdapter.GroupViewHolder>{
    private List<AuthGroupsResponse> groupList;
    private Context context;

    public GroupAdapter(Context context, List<AuthGroupsResponse> groupList) {
        this.context = context;
        this.groupList = groupList;
    }
    @NonNull
    @Override
    public GroupViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.group_item_category,parent, false);
        return new GroupViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull GroupViewHolder holder, int position){
        AuthGroupsResponse group = groupList.get(position);
        holder.nameTextView.setText(group.getName());
        holder.descriptionTextView.setText(group.getDescription());
        Glide.with(context)
                .load(group.getProfileImagePath())
                .into(holder.imageView);
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, GroupPage.class);
            intent.putExtra("groupId", group.getId());
            context.startActivity(intent);
        });
    }
    @Override
    public int getItemCount() {
        return groupList.size();
    }
    public static class GroupViewHolder extends RecyclerView.ViewHolder{
        ImageView imageView;
        TextView nameTextView;
        TextView descriptionTextView;
        public GroupViewHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.group_image);
            nameTextView = itemView.findViewById(R.id.group_name);
            descriptionTextView = itemView.findViewById(R.id.group_description);
        }
    }
}

