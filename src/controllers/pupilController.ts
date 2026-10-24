import type { Request, Response } from "express";
import { pupilService } from "../services/pupilService";
import type { ListPupilsQuery } from "../interface/pupil";

export const pupilController = {
  async list(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const query = req.validatedQuery as ListPupilsQuery;
    const result = await pupilService.listForSchool(organizationId, query);
    res.status(200).json(result);
  },

  async getOne(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const pupil = await pupilService.getById(organizationId, req.params.id as string);
    res.status(200).json(pupil);
  },

  async create(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const pupil = await pupilService.create(organizationId, req.body);
    res.status(201).json(pupil);
  },

  async update(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const pupil = await pupilService.update(organizationId, req.params.id as string, req.body);
    res.status(200).json(pupil);
  },

  async remove(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    await pupilService.delete(organizationId, req.params.id as string);
    res.status(204).send();
  },

  async move(req: Request, res: Response) {
    const organizationId = req.auth!.organizationId;
    const pupils = await pupilService.moveMany(organizationId, req.body);
    res.status(200).json(pupils);
  },
};
