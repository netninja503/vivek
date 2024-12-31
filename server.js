const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/college_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Create a Mongoose schema for student applications
const studentSchema = new mongoose.Schema({
  studentName: String,
  fatherName: String,
  motherName: String,
  dob: String,
  course: String,
});

const Student = mongoose.model('Student', studentSchema);

// Serve the index.html page
app.use(express.static(path.join(__dirname)));

// Handle POST request for student application
app.post('/apply', (req, res) => {
  const { studentName, fatherName, motherName, dob, course } = req.body;

  // Create a new Student document
  const newStudent = new Student({
    studentName,
    fatherName,
    motherName,
    dob,
    course,
  });

  // Save the student data to MongoDB
  newStudent.save()
    .then(() => {
      res.json({ message: 'Application submitted successfully!' });
    })
    .catch((err) => {
      console.error('Error saving application:', err);
      res.status(500).json({ message: 'Error submitting application' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
