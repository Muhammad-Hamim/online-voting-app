# Online Voting App

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Live Demo](#live-demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview
The **Online Voting App** is a comprehensive web application designed to facilitate secure and efficient online voting. It offers a seamless experience for both voters and administrators, ensuring that the voting process is accessible, transparent, and secure.

## Features

### Authentication
- **User Login**: Users must log in to access the app.
- **User Registration**: New users can register by filling out a simple form.
- **Password Reset**: Users can reset their passwords via an email link if forgotten.

### User Dashboard
- **Profile Management**: 
  - View detailed profile information.
  - Update personal information.
  - Change account password.
  
- **Votes**:
  - **Live Votes**: 
    - View all ongoing elections.
    - Cast votes for candidates in active elections.
  - **Closed Votes**:
    - View details of completed elections, including winners.
    - See all candidates who participated, along with their vote counts.
  - **Position**:
    - View upcoming election positions with application deadlines.
    - Apply to participate as a candidate in upcoming elections.
  - **Voting History**:
    - View a detailed history of your voting activity.
    - See the positions, candidates, and your vote details, including the time of voting.

- **Logout**: Easily log out of the application.

### Admin Dashboard
- **Admin Features**: Manage elections, candidates, and voter lists (Details to be added).

## Technologies Used
- **Frontend**: 
  - React.js
  - TypeScript
  - HTML5
  - CSS3
  - TailwindCSS
- **Backend**:
  - Node.js
  - Express.js
  - TypeScript
  - Mongoose
- **Database**:
  - MongoDB
- **Authentication**:
  - JWT (JSON Web Tokens)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Muhammad-Hamim/online-voting-app.git
    cd online-voting-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
      ```bash
      NODE_ENV=development
      PORT=5000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```

4. **Run the application**:
    ```bash
    npm start
    ```

5. **Access the application**:
    - Open your browser and go to `http://localhost:5000`.

## Usage

### User Access
- **Login/Register**: Begin by logging in or registering a new account.
- **Explore Dashboard**:
  - Manage your profile.
  - Participate in live votes or review closed elections.
  - Apply for upcoming election positions.
  - Review your voting history.

### Admin Access
- **Admin Dashboard**: (Admin features to be detailed).

## Live Demo

Check out the live version of the application [here](https://online-voting-app-client.vercel.app/).

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.



## Contact

**Muhammad Hamim**  
- [GitHub](https://github.com/Muhammad-Hamim)
- [LinkedIn](https://www.linkedin.com/in/muhammadhamim01/)
