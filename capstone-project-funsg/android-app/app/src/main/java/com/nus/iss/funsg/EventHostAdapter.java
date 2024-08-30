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

public class EventHostAdapter extends RecyclerView.Adapter<EventHostAdapter.EventViewHolder>{
    private List<AuthEventsResponse> eventsList;
    private Context context;
    public EventHostAdapter(Context context, List<AuthEventsResponse> eventsList){
        this.context = context;
        this.eventsList=new ArrayList<>(eventsList);
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View view = LayoutInflater.from(context).inflate(R.layout.event_host_item,parent,false);
        return new EventViewHolder(view);
    }
    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position){
        AuthEventsResponse event=eventsList.get(position);
        holder.eventName.setText(event.getName());
        holder.eventTime.setText(DateUtils.formatDateString(event.getStart()));
        int eventParticipantsNumber=event.getEventParticipants().size();
        int eventMaxParticipants=event.getMaxParticipants();
        holder.eventParticipants.setText(String.valueOf(eventParticipantsNumber)+"/"+String.valueOf(eventMaxParticipants));
        holder.eventDashboard.setPaintFlags(holder.eventDashboard.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        holder.eventDashboard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, EventDashboard.class);
                intent.putExtra("eventId",event.getId());
                context.startActivity(intent);
            }
        });
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, EventPage.class);
                intent.putExtra("eventId",event.getId());
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return eventsList.size();
    }
    public static class EventViewHolder extends RecyclerView.ViewHolder{
        TextView eventName, eventTime,eventParticipants;
        TextView eventDashboard;
        public EventViewHolder(@NonNull View itemView){
            super(itemView);
            eventName=itemView.findViewById(R.id.event_name);
            eventTime=itemView.findViewById(R.id.event_start_date);
            eventParticipants=itemView.findViewById(R.id.event_participants);
            eventDashboard=itemView.findViewById(R.id.event_dashboard);
        }
    }
    public void updateEvents(List<AuthEventsResponse> newEventsList){
        eventsList.clear();
        eventsList.addAll(newEventsList);
        notifyDataSetChanged();
    }
}
