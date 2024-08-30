# FunSG Mobile Part (Android)

**NOTE:** This part of the project is based on Android 10 (API 29) and uses Java to build and run.

### Project Introduction

This project allows users to discover events and groups that match their interests based on their unique MBTI type. It uses machine learning to make personalized suggestions, enabling users to explore different events on the app. Users can join any group or event, and even discover amazing photos from past events. We hope this project helps people find their interests and make friends through every participation.

### How to Run

1. **Clone the Repository**  
   After cloning the code into a local directory, please use Android Studio to build and run the project.
   ```
   git clone git@github.com:SA58-Team8/Android.git
   //or
   git clone https://github.com/SA58-Team8/Android.git
   ```

3. **Modify Configuration**  
   This project requires a backend server to acquire data and the Google Cloud Server API to build the embedded Google Map.  
   Please update the following files:
   - `IPAddress.java`
   - `strings.xml`

   For example:
   - In `strings.xml`: update  
     `<string name="google_map_key">YOUR_GOOGLE_MAPS_API_KEY</string>`
   - In `IPAddress.java`: update  
     `public static final String ipAddress`

## Acknowledgments

The entire FunSG project was created by NUS-ISS SA58 Team 8 members. We thank everyone again for their great contributions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


