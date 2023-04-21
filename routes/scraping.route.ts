import express from "express";
import scrappingHandlers from "../handlers/index";
const router = express.Router();
router.route("/get").get(scrappingHandlers.handleGetMethod);
router.route("/").get(scrappingHandlers.handleProcessPdf);
export default router;
