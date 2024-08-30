package com.nus.iss.funsg;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class HostEvents extends AppCompatActivity {
    private RecyclerView recyclerView;
    private EventHostAdapter adapter;
    private List<AuthEventsResponse> eventsList = new ArrayList<>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_host_events);
        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new EventHostAdapter(this,eventsList);
        recyclerView.setAdapter(adapter);
        ImageButton backBtn = findViewById(R.id.back_button_event_manage);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        fetchEvents();
    }
    private void fetchEvents(){
        Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getHostEvents(UserLoginStatus.getUserId(this)).enqueue(new Callback<List<AuthEventsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    eventsList.clear();
                    eventsList.addAll(response.body());
                    adapter.updateEvents(new ArrayList<>(eventsList));
                }
                else if (response.isSuccessful() && response.body() == null){
                    Toast.makeText(HostEvents.this, "You have not organized any event", Toast.LENGTH_SHORT).show();
                }
                else{
                    Log.e("ResponseError", "Failed to load: " + response.message());
                    Toast.makeText(HostEvents.this, "Failed to load events", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {
                Log.e("ResponseFailure", "Failed to load: " + t.getMessage(), t);
                Toast.makeText(HostEvents.this, "Error fetching", Toast.LENGTH_SHORT).show();
            }
        });
    }
}