package com.nus.iss.funsg;

import android.Manifest;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.gms.common.api.Status;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.widget.Autocomplete;
import com.google.android.libraries.places.widget.AutocompleteActivity;
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class ModifyEvent extends AppCompatActivity {

    private ActivityResultLauncher<Intent> autocompleteLauncher;

    private EditText eventNameEditText;
    private EditText startDateEditText;
    private EditText endDateEditText;
    private TextView eventParticipantsEditText;
    private TextView editTextLocation;
    private TextView eventDescriptionEditText;
    private ImageButton backBtn;
    private Button submitBtn;
    private Button cancelBtn;
    private LinearLayout uploadImageBtn;

    private Calendar calendar;
    private SimpleDateFormat dateFormat;
    private long eventId;
    private int existingParticipants,maxParticipants;
    private long groupId;
    private String eventName,eventLocation,eventEndDate,eventStartDate,eventDescription;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_modify_event);
        eventId=getIntent().getLongExtra("eventId",0L);
        existingParticipants=getIntent().getIntExtra("existingParticipants",0);
        eventName=getIntent().getStringExtra("eventName");
        eventLocation=getIntent().getStringExtra("eventLocation");
        eventEndDate=getIntent().getStringExtra("eventEndDate");
        eventStartDate=getIntent().getStringExtra("eventStartDate");
        eventDescription=getIntent().getStringExtra("eventDescription");
        imageUrl=getIntent().getStringExtra("eventImageUrl");
        maxParticipants=getIntent().getIntExtra("maxParticipants",0);



        groupId=getIntent().getLongExtra("groupId",-1L);
        if (!Places.isInitialized()) {
            Places.initialize(getApplicationContext(),getString(R.string.google_map_key));
        }
        editTextLocation = findViewById(R.id.edit_text_location);
        editTextLocation.setHint(eventLocation);

        autocompleteLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        Place place = Autocomplete.getPlaceFromIntent(result.getData());
                        String placeName = place.getName();
                        String placeAddress = place.getAddress();
                        editTextLocation.setText(placeName+", "+placeAddress);
                    } else if (result.getResultCode() == AutocompleteActivity.RESULT_ERROR) {
                        Status status = Autocomplete.getStatusFromIntent(result.getData());
                        Log.i("MainActivity", status.getStatusMessage());
                    }
                }
        );
        editTextLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                List<Place.Field> fields = Arrays.asList(Place.Field.ID, Place.Field.NAME, Place.Field.ADDRESS);
                Intent intent = new Autocomplete.IntentBuilder(AutocompleteActivityMode.FULLSCREEN, fields)
                        .build(ModifyEvent.this);
                autocompleteLauncher.launch(intent);
            }
        });
        startDateEditText = findViewById(R.id.start_date);
        startDateEditText.setHint(DateUtils.formatDateStringInHint(eventStartDate));
        endDateEditText = findViewById(R.id.end_date);
        endDateEditText.setHint(DateUtils.formatDateStringInHint(eventEndDate));

        calendar = Calendar.getInstance();
        dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
        startDateEditText.setOnClickListener(v -> showDatePickerDialog(startDateEditText));
        endDateEditText.setOnClickListener(v -> showDatePickerDialog(endDateEditText));

        eventNameEditText=findViewById(R.id.event_name);
        eventNameEditText.setHint(eventName);

        eventDescriptionEditText=findViewById(R.id.event_description);
        eventDescriptionEditText.setHint(eventDescription);

        eventParticipantsEditText=findViewById(R.id.event_participants);
        eventParticipantsEditText.setHint(String.valueOf(maxParticipants));

        backBtn=findViewById(R.id.back_button_modify_event);

        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        uploadImageBtn=findViewById(R.id.upload_image_btn);
        uploadImageBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                requestStoragePermission();
            }
        });
        submitBtn=findViewById(R.id.submit_modify_btn);
        cancelBtn=findViewById(R.id.cancel_event_btn);
        submitBtn.setOnClickListener(v-> submitEvent());
        cancelBtn.setOnClickListener(v-> showCancelEventDialog());
    }
    private void submitEvent(){
        String name,startDate,endDate,description,location;
        int maxParticipants;
        if(!eventNameEditText.getText().toString().isEmpty()){
            name = eventNameEditText.getText().toString().trim();
        }
        else{
            name = eventNameEditText.getHint().toString();
        }

        if (!startDateEditText.getText().toString().isEmpty()){
            startDate = startDateEditText.getText().toString().trim();
        }
        else {
            startDate = startDateEditText.getHint().toString();
        }

        if (!endDateEditText.getText().toString().isEmpty()){
            endDate = endDateEditText.getText().toString().trim();
        }
        else {
            endDate = endDateEditText.getHint().toString();
        }

        if(!eventDescriptionEditText.getText().toString().isEmpty()){
            description = eventDescriptionEditText.getText().toString().trim();
        }
        else description = eventDescriptionEditText.getHint().toString();

        if(!editTextLocation.getText().toString().isEmpty()){
            location = editTextLocation.getText().toString().trim();
        }
        else location = editTextLocation.getHint().toString();

        if(!eventParticipantsEditText.getText().toString().isEmpty()){
            maxParticipants = Integer.parseInt(eventParticipantsEditText.getText().toString().trim());
        }
        else maxParticipants=Integer.parseInt(eventParticipantsEditText.getHint().toString());

        //add condition
        if(maxParticipants<existingParticipants){
            Toast.makeText(ModifyEvent.this, "attendees can't smaller than existing members: "+existingParticipants, Toast.LENGTH_SHORT).show();
            return;
        }


        try{
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime startDateTime = LocalDateTime.parse(startDate, inputFormatter);
            LocalDateTime endDateTime = LocalDateTime.parse(endDate, inputFormatter);

            LocalDateTime now = LocalDateTime.now();

            if (startDateTime.isBefore(now)) {
                Toast.makeText(ModifyEvent.this, "Start time cannot be earlier than current date and time", Toast.LENGTH_SHORT).show();
                return;
            }

            if(startDateTime.isAfter(endDateTime)){
                Toast.makeText(ModifyEvent.this, "Start time cannot be later than end time", Toast.LENGTH_SHORT).show();
                return;
            }

            String formattedStartDate = AuthCreateEventRequest.formatDateTime(startDateTime);
            String formattedEndDate = AuthCreateEventRequest.formatDateTime(endDateTime);
            AuthCreateEventRequest eventRequest=new AuthCreateEventRequest(name, formattedStartDate, formattedEndDate, description, location, maxParticipants, imageUrl);
            Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
            AuthService authServiceForSubmit=retrofit.create(AuthService.class);
            authServiceForSubmit.modifyEvent(eventId,eventRequest).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(ModifyEvent.this, "Event Details Change", Toast.LENGTH_SHORT).show();
                        finish();
                    }else {
                        try {
                            String errorMessage = response.errorBody().string();
                            Log.e("modifyEventFailed", "Modify failed: HTTP " + response.code() + " - " + errorMessage);
                        } catch (IOException e) {
                            Log.e("modifyEventFailed", "Error reading error body", e);
                        }
                        Toast.makeText(ModifyEvent.this, "Modify failed", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Log.e("ModifyEventOnFailure", "Modify error: " + t.getMessage(), t);
                    Toast.makeText(ModifyEvent.this, "Modify error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
        catch (Exception e) {
            Toast.makeText(this, "Invalid date format. Please use yyyy-MM-dd HH:mm.", Toast.LENGTH_SHORT).show();
        }
    }

    private void cancelEvent(){
        AuthService authService=RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this)).create(AuthService.class);
        authService.deleteEvent(eventId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(ModifyEvent.this, "Event deleted successfully", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(ModifyEvent.this, MainActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                } else {
                    Log.e("cancelEventFailed", "Error reading error body"+ response.message());
                    Toast.makeText(ModifyEvent.this, "Failed to delete event", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("DeleteEventOnFailure", "delete error: " + t.getMessage(), t);
                Toast.makeText(ModifyEvent.this, "dealing onFailure: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
    private void showCancelEventDialog(){
        new AlertDialog.Builder(this)
                .setTitle("Cancel Event")
                .setMessage("Do you want to cancel this event? \t Warning, this action is irreversible")
                .setPositiveButton("Yes", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        cancelEvent();
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
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
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
        Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
        AuthService authService=retrofit.create(AuthService.class);
        if(groupId!=-1L){
            Call<ResponseBody> call= authService.uploadEventImage(groupId,body);
            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()){
                        try{
                            imageUrl = response.body().string();
                            Toast.makeText(ModifyEvent.this, "Image uploaded successfully", Toast.LENGTH_SHORT).show();
                        }
                        catch (Exception e){//before is IOException
                            Log.e("UploadImageFailed", "Error reading response body,1", e);
                            Toast.makeText(ModifyEvent.this, "Upload failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();

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

                        Toast.makeText(ModifyEvent.this, "Upload failed", Toast.LENGTH_SHORT).show();

                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(ModifyEvent.this, "Upload failed: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    Log.e("UploadImageFailed", "onFailure: ", t);
                }
            });
        }
    }

    private void showDatePickerDialog(final TextView textView) {
        new DatePickerDialog(
                this,
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(@NonNull DatePicker view, int year, int month, int dayOfMonth) {
                        calendar.set(year, month, dayOfMonth);

                        new TimePickerDialog(
                                ModifyEvent.this,
                                new TimePickerDialog.OnTimeSetListener() {
                                    @Override
                                    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                                        calendar.set(Calendar.HOUR_OF_DAY,hourOfDay);
                                        calendar.set(Calendar.MINUTE,minute);
                                        String selectedDateTime = dateFormat.format(calendar.getTime());
                                        textView.setText(selectedDateTime);
                                    }
                                },
                                calendar.get(Calendar.HOUR_OF_DAY),
                                calendar.get(Calendar.MINUTE),
                                true
                        ).show();
                    }
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
        ).show();
    }
}