import express, {Request, Response} from "express";
import { MoreThan } from "typeorm";
import { AppDataSource } from "../config/database"; // Ensure correct import
import { GroceryItem } from "../models/GroceryItem";
import { Order } from "../models/Order";
import { authMiddleware } from "../middleware/auth";

const router: any = express.Router();

router.use(authMiddleware);

router.get("/items", async (req: Request, res: Response): Promise<any> => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const items = await itemRepository.find({ where: { inventory: MoreThan(0) } });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/order", async (req: Request, res: Response): Promise<any> => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const orderRepository = AppDataSource.getRepository(Order);

    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = new Order();
    order.user = user;
    order.orderDate = new Date();
    order.items = [];

    const items = await itemRepository.findByIds(req.body.items);
    if (items.length !== req.body.items.length) {
      return res.status(400).json({ message: "Some items are not available" });
    }

    for (const item of items) {
      if (item.inventory <= 0) {
        return res.status(400).json({ message: `Item ${item.id} is out of stock` });
      }
      item.inventory--;
      order.items.push(item);
    }

    await itemRepository.save(items);
    const savedOrder = await orderRepository.save(order);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
