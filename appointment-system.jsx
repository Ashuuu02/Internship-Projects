// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Initial data
  const initialTeachers = {
    "T001": { id: "T001", name: "Dr. Smith", department: "Computer Science" },
    "T002": { id: "T002", name: "Prof. Johnson", department: "Mathematics" },
    "T003": { id: "T003", name: "Dr. Williams", department: "Physics" },
    "T004": { id: "T004", name: "Prof. Davis", department: "Chemistry" }
  };

  const initialStudents = {
    "S001": { id: "S001", name: "Alice", major: "Computer Science" },
    "S002": { id: "S002", name: "Bob", major: "Engineering" },
    "S003": { id: "S003", name: "Charlie", major: "Biology" }
  };

  const initialSlots = {
    "T001": [
      { id: "T001-S1", time: "2023-07-15T10:00", bookedBy: null },
      { id: "T001-S2", time: "2023-07-15T11:00", bookedBy: null },
      { id: "T001-S3", time: "2023-07-16T14:00", bookedBy: "S001" }
    ],
    "T002": [
      { id: "T002-S1", time: "2023-07-16T09:00", bookedBy: null },
      { id: "T002-S2", time: "2023-07-17T10:00", bookedBy: "S002" }
    ],
    "T003": [
      { id: "T003-S1", time: "2023-07-18T13:00", bookedBy: null }
    ],
    "T004": [
      { id: "T004-S1", time: "2023-07-19T11:00", bookedBy: "S003" },
      { id: "T004-S2", time: "2023-07-19T14:00", bookedBy: null }
    ]
  };

  // State management
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  
  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem('slots');
    return saved ? JSON.parse(saved) : initialSlots;
  });
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentStudent, setCurrentStudent] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('slots', JSON.stringify(slots));
  }, [teachers, students, slots]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Book an appointment
  const bookAppointment = (teacherId, slotId, studentId) => {
    if (!studentId) {
      showNotification('Please select your student ID first', 'error');
      return;
    }
    
    setSlots(prevSlots => {
      const updatedSlots = { ...prevSlots };
      const slotIndex = updatedSlots[teacherId].findIndex(slot => slot.id === slotId);
      
      if (slotIndex !== -1 && !updatedSlots[teacherId][slotIndex].bookedBy) {
        updatedSlots[teacherId][slotIndex] = {
          ...updatedSlots[teacherId][slotIndex],
          bookedBy: studentId
        };
        showNotification(`Appointment booked with ${teachers[teacherId].name}!`, 'success');
        return updatedSlots;
      }
      
      showNotification('Slot not available', 'error');
      return prevSlots;
    });
  };

  // Cancel an appointment
  const cancelAppointment = (teacherId, slotId) => {
    setSlots(prevSlots => {
      const updatedSlots = { ...prevSlots };
      const slotIndex = updatedSlots[teacherId].findIndex(slot => slot.id === slotId);
      
      if (slotIndex !== -1) {
        updatedSlots[teacherId][slotIndex] = {
          ...updatedSlots[teacherId][slotIndex],
          bookedBy: null
        };
        showNotification('Appointment canceled', 'info');
        return updatedSlots;
      }
      
      return prevSlots;
    });
  };

  // Get student's bookings
  const getStudentBookings = () => {
    if (!currentStudent) return [];
    
    const bookings = [];
    Object.entries(slots).forEach(([teacherId, teacherSlots]) => {
      teacherSlots.forEach(slot => {
        if (slot.bookedBy === currentStudent) {
          bookings.push({
            teacher: teachers[teacherId],
            slot: slot,
            slotId: slot.id
          });
        }
      });
    });
    
    return bookings;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      {/* Notification System */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <i className="fas fa-calendar-check"></i>
          <h1>Academic Appointment System</h1>
        </div>
        <div className="student-selector">
          <select 
            value={currentStudent} 
            onChange={(e) => setCurrentStudent(e.target.value)}
          >
            <option value="">Select Student ID</option>
            {Object.values(students).map(student => (
              <option key={student.id} value={student.id}>
                {student.id} - {student.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="navigation">
        <button 
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          <i className="fas fa-home"></i> Dashboard
        </button>
        <button 
          className={currentView === 'teachers' ? 'active' : ''}
          onClick={() => setCurrentView('teachers')}
        >
          <i className="fas fa-chalkboard-teacher"></i> Teachers
        </button>
        <button 
          className={currentView === 'bookings' ? 'active' : ''}
          onClick={() => setCurrentView('bookings')}
        >
          <i className="fas fa-book"></i> My Bookings
        </button>
        <button 
          className={currentView === 'help' ? 'active' : ''}
          onClick={() => setCurrentView('help')}
        >
          <i className="fas fa-question-circle"></i> Help
        </button>
      </nav>
      
      {/* Main Content */}
      <main className="main-content">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="dashboard">
            <div className="welcome-banner">
              <h2>Welcome to Academic Appointment System</h2>
              <p>Book appointments with your teachers easily and efficiently</p>
            </div>
            
            <div className="stats">
              <div className="stat-card">
                <h3>{Object.keys(teachers).length}</h3>
                <p>Teachers Available</p>
              </div>
              <div className="stat-card">
                <h3>{Object.keys(students).length}</h3>
                <p>Registered Students</p>
              </div>
              <div className="stat-card">
                <h3>{Object.values(slots).flat().filter(slot => slot.bookedBy).length}</h3>
                <p>Appointments Booked</p>
              </div>
            </div>
            
            <div className="quick-actions">
              <button 
                className="action-button primary"
                onClick={() => setCurrentView('teachers')}
              >
                <i className="fas fa-search"></i> Find a Teacher
              </button>
              <button 
                className="action-button secondary"
                onClick={() => setCurrentView('bookings')}
                disabled={!currentStudent}
              >
                <i className="fas fa-calendar"></i> View My Bookings
              </button>
            </div>
            
            <div className="upcoming-appointments">
              <h3>Your Upcoming Appointments</h3>
              {currentStudent ? (
                getStudentBookings().length > 0 ? (
                  <div className="appointments-list">
                    {getStudentBookings().map((booking, index) => (
                      <div key={index} className="appointment-card">
                        <div className="appointment-info">
                          <h4>{booking.teacher.name}</h4>
                          <p>{formatDate(booking.slot.time)}</p>
                        </div>
                        <button 
                          className="cancel-btn"
                          onClick={() => cancelAppointment(booking.teacher.id, booking.slotId)}
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming appointments. Book one now!</p>
                )
              ) : (
                <p>Please select your student ID to view appointments</p>
              )}
            </div>
          </div>
        )}
        
        {/* Teachers View */}
        {currentView === 'teachers' && (
          <div className="teachers-view">
            <h2>Available Teachers</h2>
            
            {selectedTeacher ? (
              <div className="teacher-detail">
                <button className="back-btn" onClick={() => setSelectedTeacher(null)}>
                  <i className="fas fa-arrow-left"></i> Back to Teachers
                </button>
                
                <div className="teacher-header">
                  <div className="teacher-avatar">
                    {teachers[selectedTeacher].name.charAt(0)}
                  </div>
                  <div>
                    <h3>{teachers[selectedTeacher].name}</h3>
                    <p>Department: {teachers[selectedTeacher].department}</p>
                  </div>
                </div>
                
                <h4>Available Time Slots:</h4>
                <div className="slots-container">
                  {slots[selectedTeacher].length > 0 ? (
                    slots[selectedTeacher].map((slot, index) => (
                      <div 
                        key={slot.id} 
                        className={`slot-card ${slot.bookedBy ? 'booked' : 'available'}`}
                      >
                        <div className="slot-info">
                          <p>{formatDate(slot.time)}</p>
                          {slot.bookedBy ? (
                            <span className="status booked">Booked</span>
                          ) : (
                            <span className="status available">Available</span>
                          )}
                        </div>
                        
                        {slot.bookedBy ? (
                          slot.bookedBy === currentStudent && (
                            <button 
                              className="cancel-btn"
                              onClick={() => cancelAppointment(selectedTeacher, slot.id)}
                            >
                              Cancel
                            </button>
                          )
                        ) : (
                          <button 
                            className="book-btn"
                            onClick={() => bookAppointment(selectedTeacher, slot.id, currentStudent)}
                            disabled={!currentStudent}
                          >
                            Book Now
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No available slots for this teacher.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="teachers-grid">
                {Object.values(teachers).map(teacher => (
                  <div 
                    key={teacher.id} 
                    className="teacher-card"
                    onClick={() => setSelectedTeacher(teacher.id)}
                  >
                    <div className="teacher-avatar">
                      {teacher.name.charAt(0)}
                    </div>
                    <h3>{teacher.name}</h3>
                    <p>{teacher.department}</p>
                    <div className="slots-count">
                      {slots[teacher.id].filter(slot => !slot.bookedBy).length} slots available
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* My Bookings View */}
        {currentView === 'bookings' && (
          <div className="bookings-view">
            <h2>My Booked Appointments</h2>
            
            {currentStudent ? (
              getStudentBookings().length > 0 ? (
                <div className="bookings-list">
                  {getStudentBookings().map((booking, index) => (
                    <div key={index} className="booking-card">
                      <div className="booking-info">
                        <div className="teacher-avatar">
                          {booking.teacher.name.charAt(0)}
                        </div>
                        <div>
                          <h3>{booking.teacher.name}</h3>
                          <p className="department">{booking.teacher.department}</p>
                          <p className="appointment-time">
                            <i className="fas fa-clock"></i> {formatDate(booking.slot.time)}
                          </p>
                        </div>
                      </div>
                      <button 
                        className="cancel-btn"
                        onClick={() => cancelAppointment(booking.teacher.id, booking.slotId)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-bookings">
                  <i className="fas fa-calendar-times"></i>
                  <h3>No Bookings Found</h3>
                  <p>You haven't booked any appointments yet.</p>
                  <button 
                    className="action-button primary"
                    onClick={() => setCurrentView('teachers')}
                  >
                    Browse Teachers
                  </button>
                </div>
              )
            ) : (
              <div className="select-student">
                <i className="fas fa-user-graduate"></i>
                <h3>Select Your Student ID</h3>
                <p>Please select your student ID from the dropdown in the header to view your bookings.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Help View */}
        {currentView === 'help' && (
          <div className="help-view">
            <h2>Help & Support</h2>
            
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              
              <div className="faq-item">
                <h4>How do I book an appointment?</h4>
                <p>1. Select your student ID from the dropdown in the top right corner</p>
                <p>2. Go to the "Teachers" section</p>
                <p>3. Select a teacher to see their available time slots</p>
                <p>4. Click "Book Now" on an available slot</p>
              </div>
              
              <div className="faq-item">
                <h4>How do I cancel an appointment?</h4>
                <p>1. Go to "My Bookings"</p>
                <p>2. Find the appointment you want to cancel</p>
                <p>3. Click the "Cancel Appointment" button</p>
              </div>
              
              <div className="faq-item">
                <h4>What if I need to reschedule?</h4>
                <p>Currently, you need to cancel your existing appointment and book a new one. We're working on a rescheduling feature.</p>
              </div>
            </div>
            
            <div className="support-section">
              <h3>Contact Support</h3>
              <p>If you need further assistance, please contact:</p>
              <p><i className="fas fa-envelope"></i> support@university.edu</p>
              <p><i className="fas fa-phone"></i> (555) 123-4567</p>
              <p><i className="fas fa-clock"></i> Mon-Fri: 9am-5pm</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <p>© 2023 University Appointment System | Designed for Academic Excellence</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;