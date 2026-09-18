# Airbnb Clone

A full-stack Airbnb-style web application built with **Node.js, Express.js, MongoDB, Mongoose, and EJS**. The project allows users to browse homes, view details, create accounts, manage listings, upload property images and house-rules PDFs, add homes to favourites, and make reservations.

## Features

### User Authentication
- User signup and login
- Session-based authentication
- Guest and host user types
- Protected routes for authenticated users

### Guest Features
- Browse available homes
- View detailed information about a home
- Add/remove homes from favourites
- View favourite homes
- Reserve a home
- View bookings

### Host Features
- Add new homes
- Upload home images
- Upload house-rules PDF files
- View listed homes
- Edit existing home details
- Update uploaded images and house-rules files

### File Uploads
- Property images are uploaded using **Multer**
- House-rules documents are supported as PDF files
- Uploaded files are served through Express static routes

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **EJS**
- **HTML5**
- **CSS3**
- **JavaScript**
- **Multer** – file uploads
- **express-session** – session management
- **connect-mongodb-session** – MongoDB session storage
- **bcrypt** – password hashing
- **Method Override** – support for HTTP methods such as DELETE

## Project Structure

```text
Airbnb-Clone/
│
├── controllers/
│   ├── authController.js
│   ├── host-controller.js
│   └── store-controller.js
│
├── models/
│   ├── home.js
│   └── user.js
│
├── public/
│   ├── 404Error.css
│   ├── addHome.css
│   ├── home.css
│   └── styles.css
│
├── routes/
│   ├── authRouter.js
│   ├── hostRouter.js
│   └── storeRouter.js
│
├── rules/
│   └── house-rules PDF files
│
├── uploads/
│   └── uploaded property images
│
├── utils/
│
├── views/
│   ├── auth/
│   ├── host/
│   ├── partials/
│   └── store/
│
├── app.js
├── nodemon.json
├── package.json
└── package-lock.json
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Kamran-56/Airbnb-Clone.git
```

### 2. Navigate to the project directory

```bash
cd Airbnb-Clone
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root and add the required configuration, such as your MongoDB connection string and session-related settings.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

Do not upload your `.env` file to GitHub.

### 5. Start the application

For development:

```bash
npm start
```

If the project is configured to use nodemon, you can also run:

```bash
npx nodemon app.js
```

Then open the local address shown in the terminal, commonly:

```text
http://localhost:3000
```

## User Roles

### Guest

A guest can:
- Register and log in
- Browse homes
- View home details
- Add homes to favourites
- Remove homes from favourites
- Reserve homes
- View bookings

### Host

A host can:
- Add homes
- Upload property photos
- Upload house-rules PDFs
- View their listed homes
- Edit home information
- Replace uploaded files

## File Uploads

The application uses **Multer** to handle file uploads.

Supported property image formats include:

- JPG
- JPEG
- PNG

House-rules documents are uploaded as PDF files.

The uploaded files are stored in:

```text
uploads/
rules/
```

## Database

The project uses **MongoDB** with **Mongoose** for data storage.

The application contains models for users and homes. User information includes authentication details, user type, and favourite homes. Home information includes property details such as name, price, location, rating, description, and uploaded files.

## Authentication & Sessions

Authentication is handled using sessions. After login, session information is used to keep track of the logged-in user and their role.

Passwords are securely handled using **bcrypt** rather than storing plain-text passwords.

## Git & GitHub

The repository includes a `.gitignore` file to prevent unnecessary or sensitive files from being committed.

The following are excluded from Git:

```text
node_modules/
notes.txt
UI_ENHANCEMENTS.md
.env
.DS_Store
npm-debug.log
.vscode/
.idea/
```

Install dependencies after cloning the repository with:

```bash
npm install
```

## Future Improvements

Possible improvements include:

- Better form validation
- Improved responsive UI
- Search and filtering
- Home availability management
- Payment integration
- User profile management
- Reviews and ratings
- Image optimization
- Deployment to a cloud platform

## Author

**Kamran-56**

GitHub: https://github.com/Kamran-56

## License

Note: This project is intended for educational and development purposes. It is not a pure clone of Airbnb; rather, it was developed as a project-based learning exercise to gain practical experience with various web development technologies and concepts.
