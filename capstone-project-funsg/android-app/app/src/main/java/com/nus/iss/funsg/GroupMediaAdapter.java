package com.nus.iss.funsg;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

public class GroupMediaAdapter extends RecyclerView.Adapter<GroupMediaAdapter.EventViewHolder>{
    private List<String> photoUrlList;
    private Context context;

    public GroupMediaAdapter(Context context, List<String> photoUrlList) {
        this.context = context;
        this.photoUrlList = photoUrlList;
    }


    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        String photoUrl=photoUrlList.get(position);
        Glide.with(context).load(photoUrl).into(holder.photoImage);
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.group_media_page_item, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public int getItemCount() {
        return photoUrlList.size();
    }

    public static class EventViewHolder extends RecyclerView.ViewHolder{
        ImageView photoImage;
        public EventViewHolder(@NonNull View itemView){
            super(itemView);
            photoImage = itemView.findViewById(R.id.photo_item);
        }
    }
}
