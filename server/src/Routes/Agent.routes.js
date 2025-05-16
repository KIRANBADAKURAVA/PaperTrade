import { Router } from "express";
import { handleQuery } from "../Agent/agent.controller.js";
import { Tokenverification } from "../Middlewares/Auth.middleware.js";


const AgentRouter = Router();


AgentRouter.post('/query', Tokenverification, handleQuery);

export default AgentRouter;
