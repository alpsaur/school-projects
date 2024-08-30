## Step 1: Open the application on SpringToolSuit 4 or Intellij IDEA

## Step 2: Database Configuration
#### 1. Create schema in MySql workbench. (The schema name can be db)
#### 2. Update the database configuration on application.properties file (e.g. schema, username and password as seen below).
spring.datasource.url=jdbc:mysql://localhost:3306/db?useSSL=false&serverTimezone=Asia/Singapore  
spring.datasource.username=root  
spring.datasource.password=password
#### 3. Run the application. The data in the JavaCA.sql file will be populated into the database.

## Step 3: Open the react_app folder on Visual Studio code or WebStorm
#### 1. run the commands in terminal: npm install, npm run dev


## [Optional Step]To prevent re-populate date into the database, after running the application, make the following changes to the code.
 1. go to src/main/java/sg/edu/nus/laps/service/CalendarService.java, comment the following line of code
        wphCalendarRepository.saveAll(calendarList);

3. change JavaCA.sql under teamplates folder to JavaCA.text

4. go to src/main/java/sg/edu/nus/laps/LapsApplication.java, comment the following lines of code
   @PostConstruct
    public void init() throws SQLException {
        exec(dataSource, "JavaCA.sql");
    }
