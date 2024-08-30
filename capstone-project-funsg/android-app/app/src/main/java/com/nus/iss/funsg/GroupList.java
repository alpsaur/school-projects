package com.nus.iss.funsg;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.Spinner;
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

public class GroupList extends AppCompatActivity {
    private RecyclerView recyclerView;
    private GroupListAdapter adapter;
    private List<AuthGroupsResponse> groupsList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group_list);
        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new GroupListAdapter(this, groupsList);
        recyclerView.setAdapter(adapter);

        ImageButton backBtn = findViewById(R.id.back_button_group_list);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        Spinner spinnerCategory = findViewById(R.id.spinner_category_group_list);
        ArrayAdapter<CharSequence> adapterSpinner = ArrayAdapter.createFromResource(this,
                R.array.category_options_group_list, R.layout.custom_spinner_item);
        adapterSpinner.setDropDownViewResource(R.layout.custom_spinner_dropdown_item);
        spinnerCategory.setAdapter(adapterSpinner);
        spinnerCategory.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                String selectedCategory = adapterView.getItemAtPosition(i).toString();
                filterGroups(selectedCategory);
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        fetchGroups();
    }
    private void fetchGroups(){
        Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroupsJoined().enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    groupsList.clear();
                    groupsList.addAll(response.body());
                    adapter.updateGroups(new ArrayList<>(groupsList));
                }
                else if (response.isSuccessful() && response.body() == null){
                    Toast.makeText(GroupList.this, "You have not joined any group", Toast.LENGTH_SHORT).show();
                }
                else{
                    Log.e("ResponseError", "Failed to load: " + response.message());
                    Toast.makeText(GroupList.this, "Failed to load groups", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("ResponseFailure", "Failed to load: " + t.getMessage(), t);
                Toast.makeText(GroupList.this, "Error fetching", Toast.LENGTH_SHORT).show();
            }
        });
    }
    private void filterGroups(String category){
        List<AuthGroupsResponse> filteredList = new ArrayList<>();
        Long userId = UserLoginStatus.getUserId(this);
        for (AuthGroupsResponse group : groupsList) {
            if ("All".equals(category)) {
                filteredList.add(group);
            }
            else if ("Own".equals(category) && group.getHost().getUserId()==userId) {
                filteredList.add(group);
            } else if ("Joined".equals(category) && group.getHost().getUserId()!=userId) {
                filteredList.add(group);
            }
        }
        adapter.updateGroups(filteredList);
    }
}