import express, {Request, Response} from "express";
import { GroceryItem } from "../models/GroceryItem";
import { authMiddleware, isAdmin } from "../middleware/auth";
import { AppDataSource } from "../config/database";

const router: any = express.Router();

router.use(authMiddleware, isAdmin);

router.post("/items", async (req: Request, res: Response) => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const newItem = itemRepository.create(req.body);
    await itemRepository.save(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating grocery item" });
  }
});

router.get("/items", async (req: Request, res: Response) => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const items = await itemRepository.find();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching grocery items" });
  }
});

router.delete("/items/:id", async (req: Request, res: Response) => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const item = await itemRepository.findOneBy({ id: Number(req.params.id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await itemRepository.remove(item);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting grocery item" });
  }
});

router.put("/items/:id", async (req: Request, res: Response) => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const item = await itemRepository.findOneBy({ id: Number(req.params.id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedItem = { ...item, ...req.body };
    await itemRepository.save(updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating grocery item" });
  }
});

router.patch("/items/:id/inventory", async (req: Request, res: Response) => {
  try {
    const itemRepository = AppDataSource.getRepository(GroceryItem);
    const item = await itemRepository.findOneBy({ id: Number(req.params.id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.inventory = req.body.inventory;
    await itemRepository.save(item);
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating inventory" });
  }
});

export default router;
