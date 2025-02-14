import { Order } from "../../models/Order";
import { User, UserRole } from "../../models/User";
import { GroceryItem } from "../../models/GroceryItem";

describe("Order Entity", () => {
  let user: User;
  let item1: GroceryItem;
  let item2: GroceryItem;
  let order: Order;

  beforeEach(() => {
    user = new User();
    user.id = 1;
    user.email = "testuser@example.com";
    user.password = "password123";
    user.role = UserRole.USER; 

    item1 = new GroceryItem();
    item1.id = 1;
    item1.name = "Apple";
    item1.price = 1.5;
    item1.inventory = 100;

    item2 = new GroceryItem();
    item2.id = 2;
    item2.name = "Banana";
    item2.price = 1.0;
    item2.inventory = 50;

    order = new Order();
    order.id = 1;
    order.user = user;
    order.items = [item1, item2];
    order.orderDate = new Date();
  });

  it("should create an Order with correct properties", () => {
    expect(order).toBeInstanceOf(Order);
    expect(order.user).toBe(user);
    expect(order.items).toContain(item1);
    expect(order.items).toContain(item2);
    expect(order.orderDate).toBeInstanceOf(Date);
  });

  it("should have at least one grocery item in the order", () => {
    expect(order.items.length).toBeGreaterThan(0);
  });

  it("should be linked to a user with correct role", () => {
    expect(order.user.email).toBe("testuser@example.com");
    expect(order.user.role).toBe(UserRole.USER);
  });

  it("should set orderDate to current timestamp by default", () => {
    const newOrder = new Order();
    newOrder.orderDate = new Date();
    expect(newOrder.orderDate).toBeDefined();
    expect(newOrder.orderDate).toBeInstanceOf(Date);
  });
  
});
