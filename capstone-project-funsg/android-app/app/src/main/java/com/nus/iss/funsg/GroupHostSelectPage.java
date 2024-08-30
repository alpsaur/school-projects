package com.nus.iss.funsg;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
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

public class GroupHostSelectPage extends AppCompatActivity {
    private RecyclerView recyclerView;
    private GroupAdapterForSelect groupAdapter;
    private List<AuthGroupsResponse> groupList = new ArrayList<>();
    private ImageButton backBtn;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group_host_select_page);

        IntentFilter filter = new IntentFilter("CLOSE_ACTIVITY");
        registerReceiver(closeReceiver, filter);

        recyclerView = findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        groupAdapter = new GroupAdapterForSelect(this, groupList);
        recyclerView.setAdapter(groupAdapter);
        backBtn=findViewById(R.id.back_button_group_list);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        fetchGroupJoined();
    }
    public void fetchGroupJoined(){
        System.out.println(UserLoginStatus.getUserId(GroupHostSelectPage.this));//for test
        Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroupsJoined().enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    long userId=UserLoginStatus.getUserId(GroupHostSelectPage.this);
                    List<AuthGroupsResponse> allGroups = response.body();
                    for (AuthGroupsResponse group : allGroups) {
                        if (group.getHost().getUserId() == userId) {
                            groupList.add(group);
                        }
                    }
                    groupAdapter.notifyDataSetChanged();
                }
                else if (response.isSuccessful() && response.body() == null){
                    Toast.makeText(GroupHostSelectPage.this, "You have not joined any group", Toast.LENGTH_SHORT).show();
                }
                else{
                    Log.e("ResponseError", "Failed to load: " + response.message());
                    Toast.makeText(GroupHostSelectPage.this, "Failed to load groups", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("ResponseFailure", "Failed to load: " + t.getMessage(), t);
                Toast.makeText(GroupHostSelectPage.this, "Error fetching", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private BroadcastReceiver closeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            finish();
        }
    };

    @Override
    protected void onDestroy(){
        super.onDestroy();
        unregisterReceiver(closeReceiver);
    }
}