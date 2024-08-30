# How to Run the FunSG Application Locally

## For Backend:

1. **Clone or Download the Source Code**  
   - Git clone or download the source code of the backend.
     ```
     git clone git@github.com:SA58-Team8/FunSG.git
     //or
     git clone https://github.com/SA58-Team8/FunSG.git
     ```

2. **Open the Project in an IDE**  
   - Open the folder as a project in an IDE that supports Spring Boot (e.g., IntelliJ or Eclipse).

3. **Set Up MySQL**  
   - Open your local MySQL and create a schema.

4. **Add Environment Variables**  
   - In the IDE, under "Edit Configuration," add the following environment variables:
     - `JWT_SECRET_KEY`
     - `ML_API_KEY`
     - `MYSQL_URL`
     - `S3_ACCESS_KEY`
     - `S3_SECRET_KEY`
     - `S3_BUCKET=funsg`
     - `S3_REGION=ap-southeast-1`
   - *Note: Please refer to the markdown file 'credentials.md' for the values of the environment variables.*

5. **Run the Application**  
   - Start the application.

6. **Initialize the Database**  
   - If no errors occur, connect MySQL to the IDE, and run `MySqlScript.sql` (or copy the statements from this file and execute them in MySQL) to generate the initial data.

7. **Operate the Application**  
   - You can interact with the application in either of the following ways:
     - Use Postman to send HTTP requests.
     - Run the frontend application of FunSG locally.
