// ADVANCED JAVASCRIPT PROGRAM
// Student Management System

class Student {
  constructor(name, marks) {
    this.name = name;
    this.marks = marks;
  }

  getAverage() {
    const total = this.marks.reduce((sum, mark) => sum + mark, 0);
    return (total / this.marks.length).toFixed(2);
  }

  getGrade() {
    const avg = this.getAverage();

    if (avg >= 90) return "A+";
    if (avg >= 75) return "A";
    if (avg >= 60) return "B";
    if (avg >= 40) return "C";

    return "Fail";
  }

  displayInfo() {
    console.log("---------------");
    console.log(`Name: ${this.name}`);
    console.log(`Marks: ${this.marks.join(", ")}`);
    console.log(`Average: ${this.getAverage()}`);
    console.log(`Grade: ${this.getGrade()}`);
  }
}

// Main Database
class StudentDatabase {
  constructor() {
    this.students = [];
  }

  addStudent(student) {
    this.students.push(student);
    console.log(`${student.name} added successfully`);
  }

  showAllStudents() {
    console.log("\n===== STUDENT DATABASE =====");

    this.students.forEach((student) => {
      student.displayInfo();
    });
  }

  findTopper() {
    let topper = this.students[0];

    this.students.forEach((student) => {
      if (
        parseFloat(student.getAverage()) >
        parseFloat(topper.getAverage())
      ) {
        topper = student;
      }
    });

    console.log("\n🏆 TOPPER");
    topper.displayInfo();
  }

  searchStudent(name) {
    const found = this.students.find(
      (student) =>
        student.name.toLowerCase() === name.toLowerCase()
    );

    if (found) {
      console.log("\n🔍 STUDENT FOUND");
      found.displayInfo();
    } else {
      console.log("Student not found");
    }
  }
}

// Create Database
const db = new StudentDatabase();

// Add Students
db.addStudent(new Student("Rajat", [90, 95, 88, 91]));
db.addStudent(new Student("Aman", [70, 65, 72, 68]));
db.addStudent(new Student("Priya", [99, 97, 96, 98]));
db.addStudent(new Student("Neha", [45, 55, 50, 60]));

// Display All
db.showAllStudents();

// Find Topper
db.findTopper();

// Search Student
db.searchStudent("Priya");
