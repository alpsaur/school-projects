package com.nus.iss.funsg;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.Toast;
import android.content.pm.PackageManager;
import android.Manifest;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class CreateGroup extends AppCompatActivity {
    private ImageButton backBtn;
    private EditText groupNameText;
    private EditText groupDescriptionText;
    private Button submitBtn;
    private Spinner spinnerCategory;

    private LinearLayout uploadImageBtn;
    private String token;
    private AuthService authService;
    private ProgressBar uploadProgressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        token = UserLoginStatus.getToken(this);

        setContentView(R.layout.activity_create_group);
        spinnerCategory = findViewById(R.id.spinner_category);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.category_options, R.layout.custom_spinner_item);
        adapter.setDropDownViewResource(R.layout.custom_spinner_dropdown_item);
        spinnerCategory.setAdapter(adapter);

        backBtn=findViewById(R.id.back_button_create_group);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        groupNameText=findViewById(R.id.group_name);
        groupDescriptionText=findViewById(R.id.group_description);
        uploadImageBtn=findViewById(R.id.upload_image);
        uploadImageBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (imageUrl == null) {
                    requestStoragePermission();
                } else {
                    Toast.makeText(CreateGroup.this, "You can only upload one image", Toast.LENGTH_SHORT).show();
                }
            }
        });

        submitBtn=findViewById(R.id.create_group_submit_btn);
        submitBtn.setOnClickListener(view ->{
            String groupName =groupNameText.getText().toString();
            String groupDescription=groupDescriptionText.getText().toString();
            String category = spinnerCategory.getSelectedItem().toString();
            Long groupCategoryId=getCategoryId(category);
            if(imageUrl == null){
                Toast.makeText(this, "Please upload an image first", Toast.LENGTH_SHORT).show();
            }
            else{
                if(groupName.isEmpty()||groupDescription.isEmpty()){
                    Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                }
                else{
                    createGroup(new AuthCreateGroupRequest(groupCategoryId,groupName,groupDescription,imageUrl));
                }
            }
        });

    }


    private static final int PICK_IMAGE_REQUEST = 1;
    private static final int STORAGE_PERMISSION_CODE = 2;
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024;
    private Uri imageUri;
    private String imageUrl;
    private void requestStoragePermission(){
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
            openFileChooser();
        } else {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
        }
    }
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                openFileChooser();
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }
    private void openFileChooser() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        //noinspection deprecation
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data){
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            imageUri = data.getData();
            String fileName = getFileName(imageUri);
            try {
                InputStream inputStream = getContentResolver().openInputStream(imageUri);
                long fileSize = inputStream.available();
                if (fileSize <= MAX_FILE_SIZE) {
                    File file = new File(getCacheDir(), fileName);
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
                    Toast.makeText(this, "File size limited 20MB", Toast.LENGTH_SHORT).show();
                }
            } catch (IOException e) {
                Toast.makeText(this, "Error reading file: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("FileReadError", "Error reading file", e);
            }
        }
    }
    private void uploadImageToServer(File file){
        if (!file.exists()) {
            Toast.makeText(this, "File not exists", Toast.LENGTH_SHORT).show();
            return;
        }
        if(!file.canRead()){
            Toast.makeText(this, "File cannot be read", Toast.LENGTH_SHORT).show();
        }

        RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), file);
        MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);



        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,token);
        authService=retrofit.create(AuthService.class);
        Call<ResponseBody> call= authService.uploadImage(body);
        call.enqueue(new Callback<ResponseBody>(){
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response){

                if (response.isSuccessful()){
                    try{
                        imageUrl = response.body().string();
                        Toast.makeText(CreateGroup.this, "Image uploaded successfully", Toast.LENGTH_SHORT).show();
                    }
                    catch (Exception e){//before is IOException
                        Log.e("UploadImageFailed", "Error reading response body,1", e);
                        Toast.makeText(CreateGroup.this, "Upload failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();

                    }
                }
                else {
                    String errorMessage = "";
                    try {
                        errorMessage = response.errorBody().string();
                    } catch (IOException e) {
                        Log.e("UploadImageFailed", "Error reading error body,2", e);
                    }
                    Log.e("UploadImageFailed", "Upload failed: HTTP " + response.code() + " - " + errorMessage);

                    Toast.makeText(CreateGroup.this, "Upload failed", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {

                Toast.makeText(CreateGroup.this, "Upload failed: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("UploadImageFailed", "onFailure: ", t);
            }
        });
    }
    private String getFileName(Uri uri){
        String result = null;
        if (uri.getScheme().equals("content")) {
            try (Cursor cursor = getContentResolver().query(uri, null, null, null, null)) {
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
    private void createGroup(AuthCreateGroupRequest request){
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,token);
        authService=retrofit.create(AuthService.class);
        Call<Void> call = authService.createGroup(request);
        call.enqueue(new Callback<Void>(){
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(CreateGroup.this, "Your application has been referred to the administrator for review, please wait.", Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(CreateGroup.this, "Group creation failed", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(CreateGroup.this, "Group creation failed: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    public static Long getCategoryId(String categoryName){
        long id = 1;
        switch (categoryName){
            case "Creative Arts":
                id=1;
                break;
            case "Business Tech":
                id=2;
                break;
            case "Community Causes":
                id=3;
                break;
            case "Health Lifestyle":
                id=4;
                break;
            case "Lifelong Learning":
                id=5;
                break;
            case "Outdoor Hobbies":
                id=6;
                break;
        }
        return id;
    }
}