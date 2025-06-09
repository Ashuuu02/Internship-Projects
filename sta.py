class AppointmentSystem:
    def __init__(self):
        self.teachers = {"T001": "Dr. Smith", "T002": "Prof. Johnson"}
        self.students = {"S001": "Alice", "S002": "Bob"}
        # Format: {teacher_id: [{"slot": "datetime", "booked_by": None/student_id}]}
        self.slots = {
            "T001": [
                {"slot": "2023-06-15 10:00", "booked_by": None},
                {"slot": "2023-06-15 11:00", "booked_by": None}
            ],
            "T002": [
                {"slot": "2023-06-16 14:00", "booked_by": None},
                {"slot": "2023-06-16 15:00", "booked_by": None}
            ]
        }

    def show_menu(self):
        while True:
            print("\n--- Appointment Booking System ---")
            print("1. View Teachers")
            print("2. View Available Slots")
            print("3. Book Appointment")
            print("4. View My Bookings")
            print("5. Exit")
            
            choice = input("Enter choice: ")
            
            if choice == "1":
                print("\nTeachers:")
                for tid, name in self.teachers.items():
                    print(f"{tid}: {name}")
            
            elif choice == "2":
                teacher_id = input("Enter teacher ID: ")
                if teacher_id in self.slots:
                    print("\nAvailable slots:")
                    for slot in self.slots[teacher_id]:
                        if not slot["booked_by"]:
                            print(f"- {slot['slot']}")
                else:
                    print("Invalid teacher ID")
            
            elif choice == "3":
                student_id = input("Enter your student ID: ")
                teacher_id = input("Enter teacher ID: ")
                slot_time = input("Enter slot time (YYYY-MM-DD HH:MM): ")
                
                if teacher_id in self.slots:
                    for slot in self.slots[teacher_id]:
                        if slot["slot"] == slot_time and not slot["booked_by"]:
                            slot["booked_by"] = student_id
                            print("Booking successful!")
                            break
                    else:
                        print("Slot not available or invalid")
                else:
                    print("Invalid teacher ID")
            
            elif choice == "4":
                student_id = input("Enter your student ID: ")
                print("\nYour bookings:")
                found = False
                for tid, slots in self.slots.items():
                    for slot in slots:
                        if slot["booked_by"] == student_id:
                            print(f"{self.teachers[tid]}: {slot['slot']}")
                            found = True
                if not found:
                    print("No bookings found")
            
            elif choice == "5":
                break
            
            else:
                print("Invalid choice")

# Run the system
if __name__ == "__main__":
    system = AppointmentSystem()
    system.show_menu()