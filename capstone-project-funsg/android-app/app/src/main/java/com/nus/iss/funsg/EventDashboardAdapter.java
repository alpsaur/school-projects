package com.nus.iss.funsg;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.List;

import de.hdodenhof.circleimageview.CircleImageView;

public class EventDashboardAdapter extends RecyclerView.Adapter<EventDashboardAdapter.AvatarViewHolder>{
    private AuthEventsResponse eventsResponse;
    private Context context;
    public EventDashboardAdapter(Context context, AuthEventsResponse eventsResponse) {
        this.context = context;
        this.eventsResponse = eventsResponse;
    }


    @NonNull
    @Override
    public AvatarViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.event_dashboard_attendees_image, parent, false);
        return new AvatarViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AvatarViewHolder holder, int position){
        String imagePath = eventsResponse.getEventParticipants().get(position).getProfileImage();
        Glide.with(context)
                .load(imagePath)
                .into(holder.avatarImageView);
    }
    @Override
    public int getItemCount() {
        return eventsResponse.getEventParticipants().size();
    }
    public static class AvatarViewHolder extends RecyclerView.ViewHolder{
        CircleImageView avatarImageView;
        public AvatarViewHolder(@NonNull View itemView) {
            super(itemView);
            avatarImageView = itemView.findViewById(R.id.circleImageView);
        }
    }
}
