import express, { Request, Response } from "express";

import {
  add_user,
  get_user,
  invite_user,
  get_Level,
  claim,
} from "../controller/userController";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  res.send("Test");
});

router.post("/add", async (req: Request, res: Response) => {
  const result = await add_user(
    req.body.first,
    req.body.last,
    req.body.email,
    req.body.address,
    req.body.img
  );
  if (result) {
    res.send({ res: result });
  } else {
    res.send({ res: "fail" });
  }
});

router.get("/get/:id", async (req: Request, res: Response) => {
  const result = await get_user(req.params.id);
  res.send(result);
});

router.post("/invite", async (req: Request, res: Response) => {
  const result = await invite_user(
    req.body.first,
    req.body.last,
    req.body.email,
    req.body.address,
    req.body.img,
    req.body.inviteId
  );
  res.send({ res: result });
});

router.get("/getLevel/:id", async (req: Request, res: Response) => {
  const result = await get_Level(req.params.id);
  res.send({ res: result });
});

router.get("/claim/:id", async (req: Request, res: Response) => {
  const result = await claim(req.params.id);
  res.send({ res: result });
});



export default router;
