package com.nus.iss.funsg;

import android.content.Context;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
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

public class GroupPage extends AppCompatActivity {

    private TextView groupNameTextView;
    private ImageView profileImageView;
    private TextView groupDescriptionTextView;
    private RecyclerView eventRecyclerView;
    private RecyclerView membersRecyclerView;
    private RecyclerView commentRecyclerView;
    private TextView noEventNote,noCommentNote;
    private Button joinButton;
    private Thread bgThread;

    private EditText commentEdit;
    private FrameLayout sentCommentBtn;
    private long groupId;

    private String groupNameForModify;
    private String groupDescriptionForModify;
    private String groupCategoryForModify;
    private String groupImageForModify;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_group_page);
        groupNameTextView = findViewById(R.id.group_name);
        profileImageView = findViewById(R.id.group_image);
        groupDescriptionTextView = findViewById(R.id.group_description);
        eventRecyclerView = findViewById(R.id.event_container);
        membersRecyclerView = findViewById(R.id.members_container);
        commentRecyclerView = findViewById(R.id.comment_container);
        joinButton = findViewById(R.id.join_btn);
        noEventNote=findViewById(R.id.no_event_note);
        noCommentNote=findViewById(R.id.no_comment_note);

        commentEdit=findViewById(R.id.group_comment_enter);
        sentCommentBtn=findViewById(R.id.send_button_container);

        TextView showPhotoText=findViewById(R.id.show_photo_text);
        showPhotoText.setPaintFlags(showPhotoText.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);
        showPhotoText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(GroupPage.this,GroupMediaPage.class);
                intent.putExtra("groupId",groupId);
                intent.putExtra("groupName",groupNameForModify);
                startActivity(intent);
            }
        });

        sentCommentBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(UserLoginStatus.isPreview(GroupPage.this)){
                    Toast.makeText(GroupPage.this,"You need to login first to comment.",Toast.LENGTH_SHORT);
                }
                else{
                    String comment=commentEdit.getText().toString().trim();
                    if (!comment.isEmpty()) {
                        postComment(comment);
                    }
                    commentEdit.setText("");
                    commentEdit.clearFocus();
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    if (imm != null) {
                        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
                    }
                }
            }
        });

        groupId = getIntent().getLongExtra("groupId", -1);
        setNormalJoin(groupId);
        if (groupId != -1) {
            fetchGroupDetails(groupId);
        }
        checkIfJoined(groupId);

    }
    private void setNormalJoin(long groupId){
        if(UserLoginStatus.isPreview(this)){
            joinButton.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(GroupPage.this, R.color.grey)));
            joinButton.setText("You are not logged in yet");
            joinButton.setClickable(false);
        }
        else{
            joinButton.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(GroupPage.this, R.color.paleblue)));
            joinButton.setText("Join Group");
            joinButton.setFocusable(false);
            joinButton.setClickable(true);
            joinButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    joinGroup(groupId);
                }
            });
        }
    }
    private void checkIfJoined(long groupId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroupsJoined().enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    List<AuthGroupsResponse> joinedGroup=response.body();
                    bgThread=new Thread(new Runnable() {
                        @Override
                        public void run() {
                            //check the host
                            for(int i= 0; i<joinedGroup.size();i++){
                                if(groupId==joinedGroup.get(i).getId()){
                                    if (UserLoginStatus.getUserId(GroupPage.this)==joinedGroup.get(i).getHost().getUserId()){
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                joinButton.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(GroupPage.this, R.color.green)));
                                                joinButton.setTextColor(ColorStateList.valueOf(ContextCompat.getColor(GroupPage.this, R.color.white)));
                                                joinButton.setText("Modify Group Details");
                                                joinButton.setFocusable(true);
                                                joinButton.setClickable(true);
                                                joinButton.setOnClickListener(new View.OnClickListener() {
                                                    @Override
                                                    public void onClick(View view) {
                                                        Intent intent=new Intent(GroupPage.this,ModifyGroup.class);
                                                        intent.putExtra("groupName",groupNameForModify);
                                                        intent.putExtra("groupId",groupId);
                                                        intent.putExtra("groupDescription",groupDescriptionForModify);
                                                        intent.putExtra("groupImage",groupImageForModify);
                                                        intent.putExtra("groupCategory",groupCategoryForModify);
                                                        startActivity(intent);
                                                    }
                                                });
                                            }
                                        });
                                        break;
                                    }
                                    else{
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                joinButton.setBackgroundTintList(ColorStateList.valueOf(ContextCompat.getColor(GroupPage.this, R.color.grey)));
                                                joinButton.setText("Quit Group");
                                                joinButton.setFocusable(true);
                                                joinButton.setOnClickListener(new View.OnClickListener() {
                                                    @Override
                                                    public void onClick(View view) {
                                                        quitGroup(groupId);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                    bgThread.start();
                }
                else{
                    Log.e("responseFailed", "Error reading error body"+ response.message());
                }
            }
            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("onFailure", "Error dealing data",t);
            }
        });
    }
    private void joinGroup(long groupId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.joinGroup(groupId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(GroupPage.this, "Join successfully!", Toast.LENGTH_SHORT).show();
                checkIfJoined(groupId);
                fetchGroupDetails(groupId);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });
    }
    private void quitGroup(long groupId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.quitGroup(groupId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                checkIfJoined(groupId);
                Toast.makeText(GroupPage.this, "You have quit this group", Toast.LENGTH_SHORT).show();
                setNormalJoin(groupId);
                fetchGroupDetails(groupId);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });

    }
    private void fetchGroupDetails(long groupId){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getGroupDetails(groupId).enqueue(new Callback<AuthGroupsResponse>() {
            @Override
            public void onResponse(Call<AuthGroupsResponse> call, Response<AuthGroupsResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    populateGroupDetails(response.body());
                    groupNameForModify=response.body().getName();
                    groupDescriptionForModify=response.body().getDescription();
                    groupCategoryForModify=response.body().getCategoryName();
                    groupImageForModify=response.body().getProfileImagePath();
                } else {
                    Log.e("response error", "Error reading error body"+ response.message());
                }
            }

            @Override
            public void onFailure(Call<AuthGroupsResponse> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });

        //get group events
        Retrofit retrofitEvent=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authServiceEvent=retrofitEvent.create(AuthService.class);
        authServiceEvent.getGroupEvents(groupId).enqueue(new Callback<List<AuthEventsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    displayEvents(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {

            }
        });

    }
    private void populateGroupDetails(AuthGroupsResponse group){
        groupNameTextView.setText(group.getName());
        groupDescriptionTextView.setText(group.getDescription());
        Glide.with(this)
                .load(group.getProfileImagePath())
                .into(profileImageView);

        List<AuthUserProfileResponse> MemberDisplay=new ArrayList<>();
        ConstraintLayout virtualMember=findViewById(R.id.virtual_member);
        if(group.getMembers().size()>6){
            for(int i = 0;i<5;i++){
                MemberDisplay.add(group.getMembers().get(i));
            }
            virtualMember.setVisibility(View.VISIBLE);
        }
        else{
            MemberDisplay.addAll(group.getMembers());
            virtualMember.setVisibility(View.GONE);
        }
        GroupAdapterPageMember groupAdapterPageMember=new GroupAdapterPageMember(MemberDisplay,this);
        membersRecyclerView.setAdapter(groupAdapterPageMember);
        membersRecyclerView.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,false){
            @Override
            public boolean canScrollHorizontally(){
                return false;
            }
        });
        fetchComment();

    }

    private void displayEvents(List<AuthEventsResponse> events){
        if(events.size()==0){
            noEventNote.setVisibility(View.VISIBLE);
        }
        else{
            eventRecyclerView.setLayoutManager(new LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL,false));
            GroupAdapterPageEvent groupAdapterPageEvent=new GroupAdapterPageEvent(this,events);
            eventRecyclerView.setAdapter(groupAdapterPageEvent);
        }
    }

    private void postComment(String comment){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        AuthGroupCommentRequest authGroupCommentRequest=new AuthGroupCommentRequest(comment);
        authService.postComment(groupId,authGroupCommentRequest).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(GroupPage.this, "Successfully", Toast.LENGTH_SHORT).show();
                    fetchGroupDetails(groupId);
                } else {
                    Toast.makeText(GroupPage.this, "Sending Error", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(GroupPage.this, "Sending Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("onFailure","sending comment failed",t);
            }
        });
    }
    private void fetchComment(){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        authService.getComment(groupId).enqueue(new Callback<List<AuthGroupCommentResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupCommentResponse>> call, Response<List<AuthGroupCommentResponse>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<AuthGroupCommentResponse> commentList=response.body();
                    noCommentNote.setVisibility(View.GONE);
                    commentRecyclerView.setLayoutManager(new LinearLayoutManager(GroupPage.this));
                    GroupAdapterPageComment groupAdapterPageComment=new GroupAdapterPageComment(GroupPage.this,commentList);
                    commentRecyclerView.setAdapter(groupAdapterPageComment);
                } else {
                    noCommentNote.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<List<AuthGroupCommentResponse>> call, Throwable t) {
                Toast.makeText(GroupPage.this, "load comments Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("onFailure","load comments Error",t);
            }
        });
    }

    @Override
    protected void onDestroy(){
        super.onDestroy();
        if (bgThread != null) {
            bgThread.interrupt();
        }
    }
}