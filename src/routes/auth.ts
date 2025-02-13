import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../models/User";
import { authMiddleware } from "../middleware/auth";

const router: any = express.Router();


const JWT_SECRET = process.env.JWT_SECRET || "";

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
    });

    await userRepository.save(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up user" });
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing in user" });
  }
});

router.get("/profile", authMiddleware, async (req: any, res: Response): Promise<any> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

export default router;
