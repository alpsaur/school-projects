package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class GroupAdapterPageEvent extends RecyclerView.Adapter<GroupAdapterPageEvent.EventViewHolder>{
    private List<AuthEventsResponse> eventList;
    private Context context;
    public GroupAdapterPageEvent(Context context,List<AuthEventsResponse> eventList) {
        this.eventList = new ArrayList<>(eventList);
        this.context = context;
    }
    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.event_list_group_view, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        AuthEventsResponse event=eventList.get(position);
        holder.titleTextView.setText(event.getName());
        holder.timeTextView.setText(DateUtils.formatDateString(event.getStart()));
        holder.participantsTextView.setText(String.valueOf(event.getEventParticipants().size()));
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, EventPage.class);
            intent.putExtra("eventId", event.getId());
            context.startActivity(intent);
        });
    }


    @Override
    public int getItemCount() {
        return eventList.size();
    }
    public static class EventViewHolder extends RecyclerView.ViewHolder{
        TextView titleTextView;
        TextView timeTextView;
        TextView participantsTextView;
        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.event_title_group);
            timeTextView = itemView.findViewById(R.id.event_time_group);
            participantsTextView = itemView.findViewById(R.id.event_participants_group);
        }
    }
}
