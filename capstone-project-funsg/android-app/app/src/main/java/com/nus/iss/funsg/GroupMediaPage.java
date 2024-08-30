package com.nus.iss.funsg;

import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class GroupMediaPage extends AppCompatActivity {

    private ImageButton backBtn;
    private long groupId;
    private String groupName;
    private TextView groupNameText;
    private RecyclerView photoRecycler;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group_media_page);

        groupId=getIntent().getLongExtra("groupId",0L);
        photoRecycler=findViewById(R.id.photo_container);
        groupName=getIntent().getStringExtra("groupName");
        backBtn=findViewById(R.id.back_button_group_media);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        groupNameText=findViewById(R.id.group_name);
        groupNameText.setText(groupName);

        fetchPhoto();
    }
    private void fetchPhoto(){
        Retrofit retrofit=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroupPhoto(groupId).enqueue(new Callback<List<String>>() {
            @Override
            public void onResponse(Call<List<String>> call, Response<List<String>> response) {
                if (response.isSuccessful() && response.body() != null){
                    updatePhoto(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<String>> call, Throwable t) {

            }
        });
    }

    private void updatePhoto(List<String> photoUrlList){
        photoRecycler.setLayoutManager(new LinearLayoutManager(GroupMediaPage.this));
        GroupMediaAdapter adapter=new GroupMediaAdapter(this,photoUrlList);
        photoRecycler.setAdapter(adapter);
    }
}