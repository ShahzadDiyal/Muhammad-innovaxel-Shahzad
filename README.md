A simple URL shortening service built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v16 or higher)
   - MongoDB (local or cloud instance)
   - Git

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShahzadDiyal/Muhammad-innovaxel-Shahzad.git
   cd Muhammad-innovaxel-Shahzad
   git checkout dev
   ```

3. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     npm install
     ```
   - Ensure MongoDB is running locally on `mongodb://localhost:27017`.
   - Start the backend:
     ```bash
     npm start
     ```

4. **Frontend Setup**:
   - Place `index.html` in the `frontend` directory.
   - Serve it using a simple HTTP server:
     ```bash
     cd frontend
     npx serve --listen 3005
     ```
   - Access at `http://localhost:3005`.

5. **Testing**:
   - Use the frontend to shorten and update URLs.
   - Test API endpoints with Postman:
     - POST `http://localhost:5000/shorten`
     - GET `http://localhost:5000/shorten/:shortCode`
     - GET `http://localhost:5000/:shortCode` (redirect)
     - PUT `http://localhost:5000/shorten/:shortCode`
     - DELETE `http://localhost:5000/shorten/:shortCode`
     - GET `http://localhost:5000/stats/:shortCode`

6. **Notes**:
   - Backend runs on port 5000.
   - Frontend uses Tailwind CSS via CDN.
   - Short codes are 6-character alphanumeric.
   - Stats track access counts.

## Submission
- Repository: `Muhammad-innovaxel-Shahzad` (public)
- Branch: `dev` for code, `main` for README
- Reviewer: Junaid Hussnain
