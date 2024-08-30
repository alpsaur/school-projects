package com.nus.iss.funsg;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.media.Image;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;


public class NavPersonFragment extends Fragment {
    private Button logOutBtn;
    private Button createGroupBtn;
    private Button createEventBtn;
    private Button manageEventBtn;
    private TextView usernameText;
    private TextView emailText;
    private String username;
    private String email;

    private ImageView userImage;
    private LinearLayout groupJoinedBtn;
    private LinearLayout eventJoinedBtn;
    private TextView groupJoinedNumberText;
    private TextView eventJoinedNumberText;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_nav_person, container, false);
    }

    @Override
    public void onStart(){
        super.onStart();
        View view = getView();

        username = UserLoginStatus.getUsername(getContext());
        email = UserLoginStatus.getEmail(getContext());

        usernameText=view.findViewById(R.id.username);
        emailText=view.findViewById(R.id.email);
        usernameText.setText(username);
        emailText.setText(email);

        logOutBtn=view.findViewById(R.id.log_out_btn);
        logOutBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                UserLoginStatus.clearUserInfo(getContext());
                logout();
                Intent intent = new Intent(getActivity(), FirstLaunch.class);
                startActivity(intent);
                getActivity().finish();
            }
        });

        createGroupBtn=view.findViewById(R.id.create_new_group);
        createGroupBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(),CreateGroup.class);
                startActivity(intent);
            }
        });
        createEventBtn=view.findViewById(R.id.create_new_event);
        createEventBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(getContext(),GroupHostSelectPage.class);
                startActivity(intent);
            }
        });
        manageEventBtn=view.findViewById(R.id.manage_events);
        manageEventBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(getContext(),HostEvents.class);
                startActivity(intent);
            }
        });

        userImage=view.findViewById(R.id.user_profile_image);
        groupJoinedBtn=view.findViewById(R.id.group_joined_btn);
        eventJoinedBtn=view.findViewById(R.id.event_joined_btn);
        groupJoinedNumberText=view.findViewById(R.id.group_joined_number);
        eventJoinedNumberText=view.findViewById(R.id.event_joined_number);
        groupJoinedBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(getContext(), GroupList.class);
                startActivity(intent);
            }
        });
        eventJoinedBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent=new Intent(getContext(), EventList.class);
                startActivity(intent);
            }
        });

        userImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showUpdateImageDialog();
            }
        });

        fetchUserInfo();

    }
    private void fetchUserInfo(){
        Retrofit retrofitImage=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authServiceImage=retrofitImage.create(AuthService.class);
        authServiceImage.getUserProfile().enqueue(new Callback<AuthUserProfileResponse>() {
            @Override
            public void onResponse(Call<AuthUserProfileResponse> call, Response<AuthUserProfileResponse> response) {
                if (response.isSuccessful() && response.body() != null){
                    if (isAdded() && getContext() != null){
                        Glide.with(getContext()).load(response.body().getProfileImage()).into(userImage);
                        UserLoginStatus.saveUserId(getContext(),response.body().getUserId());
                    }
                }
                else {
                    Log.e("UserResponseError", "Failed to load user image: " + response.message());
                    Toast.makeText(getContext(), "Failed to load image", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AuthUserProfileResponse> call, Throwable t) {
                Log.e("UserResponseFailure", "Error fetching: " + t.getMessage(), t);
                Toast.makeText(getContext(), "Error fetching user image", Toast.LENGTH_SHORT).show();
            }
        });
        Retrofit retrofitGroup=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authServiceGroup=retrofitGroup.create(AuthService.class);
        authServiceGroup.getGroupsJoined().enqueue(new Callback<List<AuthGroupsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthGroupsResponse>> call, Response<List<AuthGroupsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    int GroupNumber=response.body().size();
                    groupJoinedNumberText.setText(String.valueOf(GroupNumber));
                } else if (response.isSuccessful() && response.body() == null) {
                    groupJoinedNumberText.setText("0");
                }
            }
            @Override
            public void onFailure(Call<List<AuthGroupsResponse>> call, Throwable t) {
                Log.e("ResponseGroupFailure", "Failed to load Group: " + t.getMessage(), t);
            }
        });
        Retrofit retrofitEvent=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authServiceEvent=retrofitEvent.create(AuthService.class);
        authServiceEvent.getEventsJoined().enqueue(new Callback<List<AuthEventsResponse>>() {
            @Override
            public void onResponse(Call<List<AuthEventsResponse>> call, Response<List<AuthEventsResponse>> response) {
                if (response.isSuccessful() && response.body() != null){
                    int GroupNumber=response.body().size();
                    eventJoinedNumberText.setText(String.valueOf(GroupNumber));
                }
                else if (response.isSuccessful() && response.body() == null) {
                    eventJoinedNumberText.setText("0");
                }
            }

            @Override
            public void onFailure(Call<List<AuthEventsResponse>> call, Throwable t) {
                Log.e("ResponseEventFailure", "Failed to load Event: " + t.getMessage(), t);
            }
        });
    }

    private void showUpdateImageDialog(){
        new AlertDialog.Builder(getContext())
                .setTitle("Update Profile Picture")
                .setMessage("Do you want to update your profile picture?")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        requestStoragePermission();
                    }
                })
                .setNegativeButton("No", null)
                .show();
    }
    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int STORAGE_PERMISSION_CODE = 2;
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024;
    private Uri imageUri;
    private String imageUrl;
    private void requestStoragePermission(){
        if (ContextCompat.checkSelfPermission(getContext(), android.Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            openFileChooser();
        } else {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
        }
    }
    /** @noinspection deprecation*/
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openFileChooser();
            } else {
                Toast.makeText(getContext(), "Permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }
    private void openFileChooser() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        //noinspection deprecation
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }
    /** @noinspection deprecation*/
    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data){
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == getActivity().RESULT_OK && data != null && data.getData() != null) {
            imageUri = data.getData();
            String fileName = getFileName(imageUri);
            try {
                InputStream inputStream = getContext().getContentResolver().openInputStream(imageUri);
                long fileSize = inputStream.available();
                if (fileSize <= MAX_FILE_SIZE) {
                    File file = new File(getContext().getCacheDir(), fileName);
                    FileOutputStream outputStream = new FileOutputStream(file);
                    byte[] buffer = new byte[1024];
                    int length;
                    while ((length = inputStream.read(buffer)) > 0) {
                        outputStream.write(buffer, 0, length);
                    }
                    inputStream.close();
                    outputStream.close();
                    uploadImageToServer(file);
                } else {
                    Toast.makeText(getContext(), "File size limited 20MB", Toast.LENGTH_SHORT).show();
                }
            } catch (IOException e) {
                Toast.makeText(getContext(), "Error reading file: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("FileReadError", "Error reading file", e);
            }
        }
    }
    private String getFileName(Uri uri){
        String result = null;
        if (uri.getScheme().equals("content")) {
            try (Cursor cursor = getContext().getContentResolver().query(uri, null, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndexOrThrow(OpenableColumns.DISPLAY_NAME));
                }
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }
    private void uploadImageToServer(File file){
        if (!file.exists()) {
            Toast.makeText(getContext(), "File not exists", Toast.LENGTH_SHORT).show();
            return;
        }
        if(!file.canRead()){
            Toast.makeText(getContext(), "File cannot be read", Toast.LENGTH_SHORT).show();
        }
        RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), file);
        MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authService=retrofit.create(AuthService.class);
        Call<Void> call= authService.uploadUserImage(body);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()){
                    fetchUserInfo();
                }
                else {Log.e("response error", "Error reading error body"+ response.message());}
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("OnFailure", "error: " + t.getMessage(), t);
            }
        });
    }
    private void logout(){
        Retrofit retrofit= RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(getContext()));
        AuthService authService=retrofit.create(AuthService.class);
        authService.logout().enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if(response.isSuccessful()){
                    Log.d("logout","successful");
                }
                else Log.d("logout","server response error");
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("logoutOnFailure","failure",t);
            }
        });
    }
}