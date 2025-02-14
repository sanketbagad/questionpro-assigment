import { GroceryItem } from "../../models/GroceryItem";

describe("GroceryItem Entity", () => {
  let item: GroceryItem;

  beforeEach(() => {
    item = new GroceryItem();
    item.name = "Apple";
    item.price = 1.99;
    item.inventory = 50;
  });

  it("should create a new GroceryItem with correct properties", () => {
    expect(item).toBeInstanceOf(GroceryItem);
    expect(item.name).toBe("Apple");
    expect(item.price).toBe(1.99);
    expect(item.inventory).toBe(50);
  });

  it("should allow updating properties", () => {
    item.name = "Banana";
    item.price = 0.99;
    item.inventory = 100;

    expect(item.name).toBe("Banana");
    expect(item.price).toBe(0.99);
    expect(item.inventory).toBe(100);
  });
});
