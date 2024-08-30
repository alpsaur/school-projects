package com.nus.iss.funsg;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class CategoryGroups extends AppCompatActivity {
    private RecyclerView recyclerView;
    private GroupAdapter adapter;
    private List<AuthGroupsResponse> groupList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_category_groups);
        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.VERTICAL, false));
        Long categoryId = getIntent().getLongExtra("categoryId", 0L);
        String categoryName=getIntent().getStringExtra("categoryName");
        fetchGroupsFromServer(categoryId);
        adapter = new GroupAdapter(this, groupList);
        recyclerView.setAdapter(adapter);

        TextView categoryNameText=findViewById(R.id.category_group_name);
        categoryNameText.setText(categoryName);

    }
    private void fetchGroupsFromServer(Long categoryId){
        Retrofit retrofit=RetrofitClient.getClientNoToken(IPAddress.ipAddress);
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroups(categoryId).enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    groupList.clear();
                    groupList.addAll(response.body());
                    adapter.notifyDataSetChanged();
                }
                else {
                    Log.e("CategoryGroupsResponseError", "Failed to load groups: " + response.message());
                    Toast.makeText(CategoryGroups.this, "Failed to load groups", Toast.LENGTH_SHORT).show();

                }
            }

            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("CategoryGroupsFailure", "Error fetching groups: " + t.getMessage(), t);
                Toast.makeText(CategoryGroups.this, "Error fetching groups", Toast.LENGTH_SHORT).show();

            }
        });
    }
}