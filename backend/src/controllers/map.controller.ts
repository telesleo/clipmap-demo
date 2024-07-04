import { NextFunction, Request, Response } from 'express';
import MapService from '../services/map.service';
import {
  MAP_DATA_MISSING_MESSAGE,
  MAP_ID_MISSING_MESSAGE,
} from '../utils/response-messages';

export default class MapController {
  constructor(private service: MapService) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { status, data } = await this.service.getAll(userId);
      res.status(status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const mapId = req.params.id;
      if (!mapId) {
        res.status(400).json({
          message: MAP_ID_MISSING_MESSAGE,
        });
        return;
      }
      const { status, data } = await this.service.getOne(mapId, userId);
      res.status(status).json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { data, visibility } = req.body;
      if (typeof data !== 'string') {
        res.status(400).json({
          message: MAP_DATA_MISSING_MESSAGE,
        });
        return;
      }
      const response = await this.service.create(data, visibility, userId);
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { id } = req.params;
      const { data, visibility } = req.body;
      if (!id) {
        res.status(400).json({
          message: MAP_ID_MISSING_MESSAGE,
        });
        return;
      }
      if (typeof data !== 'string') {
        res.status(400).json({
          message: MAP_DATA_MISSING_MESSAGE,
        });
        return;
      }
      const response = await this.service.update(userId, id, data, visibility);
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          message: MAP_ID_MISSING_MESSAGE,
        });
        return;
      }
      const response = await this.service.delete(userId, id);
      res.status(response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}
