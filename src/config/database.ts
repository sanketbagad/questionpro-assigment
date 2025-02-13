import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Order } from "../models/Order";
import { GroceryItem } from "../models/GroceryItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Order, GroceryItem],
  synchronize: true,
  logging: false,
});

export const connectDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Database connected successfully!");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
