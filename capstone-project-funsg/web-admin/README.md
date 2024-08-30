# Fun_SG Admin Portal

## Project Description
Fun_SG Admin Portal is a web application built with React that enables site administrators to view real-time key performance metrics, generate monthly reports, and manage groups, events, and users.

## Project Structure of `/src`
- **`/assets`**: Contains images used in the application.
- **`/components/catalystui`**: Includes Tailwind CSS CatalystUI components.
- **`/components`**: Houses reusable React components.
- **`/hooks`**: Custom hooks to manage and encapsulate complex logic, such as fetching and mutating data.
- **`/pages`**: Layouts for each individual page within the application.
- **`/service`**: Services responsible for backend API calls and authentication.

## Local Installation & Setup

1. **Clone the repository:**
```bash
git clone git@github.com:SA58-Team8/admin-web.git
//or
git clone https://github.com/SA58-Team8/admin-web.git
 ```

2. **Navigate into the project directory:**

  ```bash
  cd admin-web
  ```
3. **Install the dependencies:**
```
bash
npm install
```

4. **Create the .env file for development:**

```bash
echo VITE_API_URL=http://localhost:8080 >> .env.development
```
This sets up the environment variables needed for development.

5. **Start the development server:**

```bash
npm run dev
```
6. **Open browser and navigate to:**
```
http://localhost:5173
```
Ensure the local backend server is running at http://localhost:8080 before accessing the application.

## Access Cloud Admin Portal
admin portal: https://admin.funsg.dev/ \
username: tom@admin.com \
password: 123456 


