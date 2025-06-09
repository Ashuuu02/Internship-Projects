class CateringSystem:
    def __init__(self):
        self.menu = {
            "APP01": {"name": "Spring Rolls", "price": 5.99},
            "MAIN01": {"name": "Chicken Curry", "price": 12.99},
            "DES01": {"name": "Chocolate Cake", "price": 6.50}
        }
        self.reservations = {}
        self.orders = {}
        self.order_counter = 1

    def show_menu(self):
        while True:
            print("\n--- Catering System ---")
            print("1. View Menu")
            print("2. Make Reservation")
            print("3. Place Order")
            print("4. View Order Details")
            print("5. Exit")
            
            choice = input("Enter choice: ")
            
            if choice == "1":
                print("\nMenu:")
                for code, item in self.menu.items():
                    print(f"{code}: {item['name']} - ${item['price']:.2f}")
            
            elif choice == "2":
                name = input("Event name: ")
                date = input("Date (YYYY-MM-DD): ")
                guests = int(input("Number of guests: "))
                res_id = f"RES{len(self.reservations)+1:03d}"
                self.reservations[res_id] = {
                    "name": name,
                    "date": date,
                    "guests": guests,
                    "order_id": None
                }
                print(f"Reservation created! ID: {res_id}")
            
            elif choice == "3":
                res_id = input("Enter reservation ID: ")
                if res_id not in self.reservations:
                    print("Invalid reservation ID")
                    continue
                
                order_items = {}
                print("\nAdd items to order (enter item code, 0 to finish):")
                while True:
                    self.show_menu()
                    item_code = input("Item code: ").upper()
                    if item_code == "0":
                        break
                    if item_code in self.menu:
                        qty = int(input("Quantity: "))
                        order_items[item_code] = qty
                    else:
                        print("Invalid item code")
                
                if order_items:
                    total = sum(self.menu[code]["price"] * qty for code, qty in order_items.items())
                    self.orders[self.order_counter] = {
                        "res_id": res_id,
                        "items": order_items,
                        "total": total
                    }
                    self.reservations[res_id]["order_id"] = self.order_counter
                    print(f"Order placed! Total: ${total:.2f}")
                    self.order_counter += 1
            
            elif choice == "4":
                order_id = int(input("Enter order number: "))
                if order_id in self.orders:
                    order = self.orders[order_id]
                    res = self.reservations[order["res_id"]]
                    print(f"\nOrder #{order_id}")
                    print(f"Event: {res['name']} on {res['date']}")
                    print("Items:")
                    for code, qty in order["items"].items():
                        print(f"- {self.menu[code]['name']} x {qty}")
                    print(f"Total: ${order['total']:.2f}")
                else:
                    print("Order not found")
            
            elif choice == "5":
                break
            
            else:
                print("Invalid choice")

# Run the system
if __name__ == "__main__":
    system = CateringSystem()
    system.show_menu()
    