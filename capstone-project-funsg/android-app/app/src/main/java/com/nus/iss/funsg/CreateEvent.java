package com.nus.iss.funsg;

import android.Manifest;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
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
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.google.android.gms.common.api.Status;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.widget.Autocomplete;
import com.google.android.libraries.places.widget.AutocompleteActivity;
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode;
import com.google.android.libraries.places.api.model.AddressComponent;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
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

public class CreateEvent extends AppCompatActivity {

    private ActivityResultLauncher<Intent> autocompleteLauncher;

    private EditText eventNameEditText;
    private TextView startDateEditText;
    private TextView endDateEditText;
    private EditText attendeeEditText;
    private TextView editTextLocation;
    private Calendar calendar;
    private EditText eventDescriptionEditText;
    private SimpleDateFormat dateFormat;
    private LinearLayout uploadImageBtn;
    private Button eventSubmitBtn;
    private AuthService authService;
    private ImageButton backBtn;

    private long groupId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_event);
        groupId=getIntent().getLongExtra("groupId",0L);
        eventNameEditText = findViewById(R.id.event_name);
        eventDescriptionEditText = findViewById(R.id.event_description);
        attendeeEditText = findViewById(R.id.event_attendees);
        eventSubmitBtn = findViewById(R.id.event_submit);
        backBtn=findViewById(R.id.back_button_create_event);

        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        if (!Places.isInitialized()) {
            Places.initialize(getApplicationContext(), getString(R.string.google_map_key));
        }
        editTextLocation = findViewById(R.id.edit_text_location);

        autocompleteLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        Place place = Autocomplete.getPlaceFromIntent(result.getData());
                        String placeName = place.getName();
                        String placeAddress = place.getAddress();
                        //List<AddressComponent> addressComponents = place.getAddressComponents().asList();
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

                List<Place.Field> fields = Arrays.asList(Place.Field.ID, Place.Field.NAME, Place.Field.ADDRESS,Place.Field.ADDRESS_COMPONENTS,
                        Place.Field.LAT_LNG);
                Intent intent = new Autocomplete.IntentBuilder(AutocompleteActivityMode.FULLSCREEN, fields)
                        .build(CreateEvent.this);
                autocompleteLauncher.launch(intent);
            }
        });


        startDateEditText = findViewById(R.id.start_date);
        endDateEditText = findViewById(R.id.end_date);
        calendar = Calendar.getInstance();
        dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
        startDateEditText.setOnClickListener(v -> showDatePickerDialog(startDateEditText));
        endDateEditText.setOnClickListener(v -> showDatePickerDialog(endDateEditText));


        uploadImageBtn=findViewById(R.id.upload_image);
        uploadImageBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (imageUrl == null){
                    requestStoragePermission();
                }else {
                    Toast.makeText(CreateEvent.this, "You can only upload one image", Toast.LENGTH_SHORT).show();
                }
            }
        });

        eventSubmitBtn.setOnClickListener(v -> submitEvent());
    }

    private void submitEvent(){
        String name = eventNameEditText.getText().toString().trim();
        String startDate = startDateEditText.getText().toString().trim();
        String endDate = endDateEditText.getText().toString().trim();
        String description = eventDescriptionEditText.getText().toString().trim();
        String location = editTextLocation.getText().toString().trim();
        int maxParticipants = Integer.parseInt(attendeeEditText.getText().toString().trim());
        if(imageUrl == null){
            Toast.makeText(this, "Please upload an image first", Toast.LENGTH_SHORT).show();
        }
        else{
            if (name.isEmpty() || startDate.isEmpty() || endDate.isEmpty() || description.isEmpty() || location.isEmpty()) {
                Toast.makeText(this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
                return;
            }
        }
        try{
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            LocalDateTime startDateTime = LocalDateTime.parse(startDate, inputFormatter);
            LocalDateTime endDateTime = LocalDateTime.parse(endDate, inputFormatter);

            LocalDateTime now = LocalDateTime.now();

            if (startDateTime.isBefore(now)) {
                Toast.makeText(CreateEvent.this, "Start time cannot be earlier than current date and time", Toast.LENGTH_SHORT).show();
                return;
            }

            if(startDateTime.isAfter(endDateTime)){
                Toast.makeText(CreateEvent.this, "Start time cannot be later than end time", Toast.LENGTH_SHORT).show();
                return;
            }

            String formattedStartDate = AuthCreateEventRequest.formatDateTime(startDateTime);
            String formattedEndDate = AuthCreateEventRequest.formatDateTime(endDateTime);
            AuthCreateEventRequest eventRequest=new AuthCreateEventRequest(name, formattedStartDate, formattedEndDate, description, location, maxParticipants, imageUrl);

            Retrofit retrofit = RetrofitClient.getClient(IPAddress.ipAddress,UserLoginStatus.getToken(this));
            AuthService authServiceForSubmit=retrofit.create(AuthService.class);
            Call<AuthEventsResponse> call= authServiceForSubmit.createEvent(groupId, eventRequest);
            call.enqueue(new Callback<AuthEventsResponse>() {
                @Override
                public void onResponse(Call<AuthEventsResponse> call, Response<AuthEventsResponse> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(CreateEvent.this, "Event created successfully", Toast.LENGTH_SHORT).show();
                        long eventId=response.body().getId();

                        Intent closeIntent = new Intent("CLOSE_ACTIVITY");
                        sendBroadcast(closeIntent);

                        Intent intent=new Intent(CreateEvent.this,EventPage.class);
                        intent.putExtra("eventId",eventId);
                        startActivity(intent);
                        finish();
                    }else {
                        try {
                            String errorMessage = response.errorBody().string();
                            Log.e("CreateEventFailed", "Creation failed: HTTP " + response.code() + " - " + errorMessage);
                        } catch (IOException e) {
                            Log.e("CreateEventFailed", "Error reading error body", e);
                        }
                        Toast.makeText(CreateEvent.this, "Creation failed", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<AuthEventsResponse> call, Throwable t) {
                    Log.e("CreateEventOnFailure", "Creation error: " + t.getMessage(), t);
                    Toast.makeText(CreateEvent.this, "Creation error: " + t.getMessage(), Toast.LENGTH_SHORT).show();

                }
            });
        }catch (Exception e) {
            Toast.makeText(this, "Invalid date format. Please use yyyy-MM-dd HH:mm.", Toast.LENGTH_SHORT).show();
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
                                CreateEvent.this,
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
        authService=retrofit.create(AuthService.class);
        Call<ResponseBody> call= authService.uploadEventImage(groupId,body);
        call.enqueue(new Callback<ResponseBody>(){
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response){

                if (response.isSuccessful()){
                    try{
                        imageUrl = response.body().string();
                        Toast.makeText(CreateEvent.this, "Image uploaded successfully", Toast.LENGTH_SHORT).show();
                    }
                    catch (Exception e){//before is IOException
                        Log.e("UploadImageFailed", "Error reading response body,1", e);
                        Toast.makeText(CreateEvent.this, "Upload failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();

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

                    Toast.makeText(CreateEvent.this, "Upload failed", Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {

                Toast.makeText(CreateEvent.this, "Upload failed: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("UploadImageFailed", "onFailure: ", t);
            }
        });
    }
}