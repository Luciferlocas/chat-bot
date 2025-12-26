import { Router } from "express";
import chatRouter from "./chat.router";

const router = Router();

router.use("/chat", chatRouter);

export default router;
