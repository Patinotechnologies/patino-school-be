import { Router } from "express";
import { pupilController } from "../controllers/pupilController";
import { authenticate } from "../middlewares/authenticate";
import { validate, validateQuery } from "../middlewares/validate";
import { createPupilSchema, listPupilsQuerySchema, movePupilsSchema, updatePupilSchema } from "../validations/pupilValidation";

export const pupilRoutes = Router();

pupilRoutes.use(authenticate);
pupilRoutes.get("/", validateQuery(listPupilsQuerySchema), pupilController.list);
pupilRoutes.post("/", validate(createPupilSchema), pupilController.create);
pupilRoutes.post("/move", validate(movePupilsSchema), pupilController.move);
pupilRoutes.get("/:id", pupilController.getOne);
pupilRoutes.patch("/:id", validate(updatePupilSchema), pupilController.update);
pupilRoutes.delete("/:id", pupilController.remove);
