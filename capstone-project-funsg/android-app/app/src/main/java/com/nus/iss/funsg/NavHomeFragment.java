package com.nus.iss.funsg;

import android.content.Intent;
import android.graphics.Paint;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.nus.iss.funsg.R;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class NavHomeFragment extends Fragment implements View.OnClickListener{
    private boolean isPreview;

    private TextView categoryText;
    private TextView upcomingEventText;
    private FrameLayout searchBtn;
    private TextView suggestedText;
    private SwitchCompat suggestedToggle;
    private Button vibeCheckBtn;
    private Button category1Btn;
    private Button category2Btn;
    private Button category3Btn;
    private Button category4Btn;
    private Button category5Btn;
    private Button category6Btn;
    private EditText searchText;
    private LinearLayout groupTextLinear;

    private RecyclerView recyclerViewGroup;
    private GroupAdapterForHome groupAdapterForHome;
    private List<AuthGroupsResponse> groupList = new ArrayList<>();

    private RecyclerView recyclerView;
    private EventAdapter eventAdapter;
    private List<AuthEventsResponse> eventList = new ArrayList<>();

    public NavHomeFragment(){}

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view =inflater.inflate(R.layout.fragment_nav_home, container, false);
        return view;
    }

    @Override
    public void onStart(){
        super.onStart();
        View view = getView();
        if(view!=null){
            //set underline
            categoryText=view.findViewById(R.id.main_text_category);
            categoryText.setPaintFlags(categoryText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
            upcomingEventText=view.findViewById(R.id.main_text_upcoming_event);
            upcomingEventText.setPaintFlags(upcomingEventText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
            suggestedToggle=view.findViewById(R.id.customSwitch);
            vibeCheckBtn=view.findViewById(R.id.vibe_check_btn);
            suggestedText=view.findViewById(R.id.suggested_word);
            vibeCheckBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Intent intent=new Intent(getContext(), WordSelectorActivity.class);
                    startActivity(intent);
                }
            });

            //it means that from launch page to click preview.
            if (getArguments() != null) {
                isPreview = getArguments().getBoolean("isPreview", false);

                if(isPreview){
                    suggestedToggle.setVisibility(View.GONE);
                    vibeCheckBtn.setClickable(false);
                    vibeCheckBtn.setTextColor(ContextCompat.getColor(getContext(),R.color.lightblack));
                    suggestedText.setTextColor(ContextCompat.getColor(getContext(),R.color.lightblack));
                    suggestedText.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View view) {
                            Toast.makeText(getContext(),
                                    "You need to log in to get suggestion.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    });
                }
                else {
                    suggestedToggle.setVisibility(View.VISIBLE);
                    suggestedToggle.setChecked(true);
                    vibeCheckBtn.setClickable(true);
                    vibeCheckBtn.setTextColor(ContextCompat.getColor(getContext(),R.color.darkblue));
                }
            }
            else {
                suggestedToggle.setVisibility(View.VISIBLE);
                suggestedToggle.setChecked(UserLoginStatus.getSuggested(getContext()));
                vibeCheckBtn.setClickable(true);
                vibeCheckBtn.setTextColor(ContextCompat.getColor(getContext(),R.color.darkblue));
            }


            searchText=view.findViewById(R.id.search_bar);
            searchBtn=view.findViewById(R.id.search_button_container);
            searchBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    String query = searchText.getText().toString().trim();
                    if (query.isEmpty()) {
                        return;
                    }
                    Intent intent=new Intent(requireContext(),SearchResult.class);
                    intent.putExtra("query", query);
                    startActivity(intent);
                }
            });

            category1Btn=view.findViewById(R.id.category_1);
            category1Btn.setOnClickListener(this);
            category2Btn=view.findViewById(R.id.category_2);
            category2Btn.setOnClickListener(this);
            category3Btn=view.findViewById(R.id.category_3);
            category3Btn.setOnClickListener(this);
            category4Btn=view.findViewById(R.id.category_4);
            category4Btn.setOnClickListener(this);
            category5Btn=view.findViewById(R.id.category_5);
            category5Btn.setOnClickListener(this);
            category6Btn=view.findViewById(R.id.category_6);
            category6Btn.setOnClickListener(this);

            
            recyclerView = view.findViewById(R.id.recycler_view_events);
            recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
            eventAdapter = new EventAdapter(getContext(), eventList);
            recyclerView.setAdapter(eventAdapter);
            fetchEvents(suggestedToggle.isChecked());
            suggestedToggle.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener(){
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    UserLoginStatus.saveSuggested(getContext(),isChecked);
                    fetchEvents(isChecked);
                }
            });

            fetchGroupsJoined();
            groupTextLinear=view.findViewById(R.id.group_text_container);
            recyclerViewGroup=view.findViewById(R.id.group_container);
        }
    }
    @Override
    public void onClick(View v) {
        Long categoryId = 0L;
        if(v.getId()==R.id.category_1){
            categoryId = 1L;
        }
        else if(v.getId()==R.id.category_2){
            categoryId = 2L;
        }
        else if(v.getId()==R.id.category_3){
            categoryId = 3L;
        }
        else if(v.getId()==R.id.category_4){
            categoryId = 4L;
        }
        else if(v.getId()==R.id.category_5){
            categoryId = 5L;
        }
        else if(v.getId()==R.id.category_6){
            categoryId = 6L;
        }
        String categoryName=((Button) v).getText().toString();
        Intent intent = new Intent(getContext(),CategoryGroups.class);
        intent.putExtra("categoryId",categoryId);
        intent.putExtra("categoryName",categoryName);
        startActivity(intent);
    }
    private void fetchEvents(boolean isRecommended){
        if(isRecommended){
            Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
            AuthService authService=retrofit.create(AuthService.class);
            authService.getEventsRecommendations().enqueue(new Callback<List<AuthEventsResponse>>() {
                @Override
                public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        eventList.clear();
                        eventList.addAll(response.body());
                        eventAdapter.updateEvents(new ArrayList<>(eventList));
                    }
                    else{
                        Log.e("EventsResponseError", "Failed to load events: " + response.message());
                        Toast.makeText(getContext(), "You have not finished your test", Toast.LENGTH_SHORT).show();
                        suggestedToggle.setChecked(false);
                    }
                }

                @Override
                public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {
                    Log.e("EventsAcquireFailure", "Error fetching events: " + t.getMessage(), t);
                    Toast.makeText(getContext(), "Error fetching events", Toast.LENGTH_SHORT).show();

                }
            });
        }
        else {
            Retrofit retrofit=RetrofitClient.getClientNoToken(IPAddress.ipAddress);
            AuthService authService=retrofit.create(AuthService.class);
            authService.getEvents().enqueue(new Callback<List<AuthEventsResponse>>() {
                @Override
                public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        eventList.clear();
                        eventList.addAll(response.body());
                        eventAdapter.updateEvents(new ArrayList<>(eventList));
                    }
                    else{
                        Log.e("EventsResponseError", "Failed to load events: " + response.message());
                        Toast.makeText(getContext(), "Failed to load events", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {
                    Log.e("EventsAcquireFailure", "Error fetching events: " + t.getMessage(), t);
                    Toast.makeText(getContext(), "Error fetching events", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
    private void fetchGroupsJoined(){
        Retrofit retrofitEvent=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authServiceGroup=retrofitEvent.create(AuthService.class);
        authServiceGroup.getGroupsJoined().enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful()&& response.body() != null){
                    groupList=new ArrayList<>(response.body());
                    if(groupList.size()!=0){
                        recyclerViewGroup.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL,false));
                        groupAdapterForHome=new GroupAdapterForHome(getContext(),groupList);
                        recyclerViewGroup.setAdapter(groupAdapterForHome);
                    }
                }
                else{
                    groupTextLinear.setVisibility(View.GONE);
                }
            }
            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("ResponseGroupFailure", "Failed to load Group: " + t.getMessage(), t);
            }
        });
    }
}