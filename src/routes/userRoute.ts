import express, { Request, Response } from "express";
import { add_user } from "../controller/userController";
import { User } from "../models/user";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("FT & NFT Airdrop");
});

router.post("/add", async (req: Request, res: Response) => {
  await add_user(req.body.account);
  res.send("Success");
});

export default router;
