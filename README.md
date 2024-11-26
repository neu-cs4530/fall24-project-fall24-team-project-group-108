# CodeScout

CodeScout is a platform designed to help users explore and navigate programming-related questions and answers. This guide will walk you through the steps required to build and run a local version of the CodeScout application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 16.x or higher)
- npm (Node Package Manager)
- MongoDB (local or hosted)

## Setup Instructions

### 1. Clone the Repository or Unpack the ZIP File

Start by obtaining the CodeScout project files:

- Clone the repository from GitHub:
  ```bash
  git clone <repository_url>
  ```
  _or_
- Unpack the `.zip` file provided during submission.

Navigate into the project directory:

```bash
cd codescout
```

### 2. Configure Environment Variables

#### Frontend Configuration

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Create a `.env` file in this directory and add the following line:
   ```env
   REACT_APP_SERVER_URL=http://localhost:8000
   ```

#### Backend Configuration

1. Navigate to the `server` directory:
   ```bash
   cd ../server
   ```
2. Create a `.env` file in this directory and add the following lines:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017
   CLIENT_URL=http://localhost:3000
   PORT=8000
   ```

### 3. Set Up and Run the Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Populate the database:
   ```bash
   npx ts-node populate_db.ts mongodb://127.0.0.1:27017/fake_so
   ```
4. Start the backend server:
   ```bash
   npx ts-node server.ts
   ```

The backend server should now be running locally at `http://localhost:8000`.

### 4. Set Up and Run the Frontend

1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run start
   ```

The frontend should now open in your default browser at `http://localhost:3000`.

## Explore CodeScout

With both the frontend and backend running, you can explore the CodeScout platform by navigating to `http://localhost:3000` in your browser. The application is now configured for local use with the ability to do the following (and more!):

- Create an account with username, password, and profile picture.
- Report inappropriate questions/answers.
- Apply to be a moderator who can review reported questions/answers.
- Earn badges based on your stats of related to questions, answers, comments, and votes.
- View an account page with details about a given user's questions, answers, earned badges, etc.
- Direct and group message other individuals.
- Receive notifications when someone messages you, when an answer is posted to your question, when you earn a new badge, etc.

## Troubleshooting

- Ensure MongoDB is running and accessible from your environment.
- Double-check the `.env` files for correct values.
- If any dependencies fail to install, ensure your Node.js and npm versions meet the prerequisites.
- Check terminal logs for detailed error messages during setup or runtime.

Enjoy exploring CodeScout!
