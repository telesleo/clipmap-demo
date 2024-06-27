import { Request, Response, NextFunction } from 'express';
import MapService from '../../services/map.service';
import MapController from '../../controllers/map.controller';
import User from '../../database/models/User';
import * as mapMock from '../mocks/map.mock';
import * as userMock from '../mocks/user.mock';
import {
  MAP_DATA_MISSING_MESSAGE,
  MAP_DELETED_MESSAGE,
  MAP_ID_MISSING_MESSAGE,
  MAP_UPDATED_MESSAGE,
} from '../../utils/response-messages';

describe('Map', () => {
  let mapService: jest.Mocked<MapService>;
  let mapController: MapController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mapService = {
      getOne: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as Partial<MapService> as jest.Mocked<MapService>;
    mapController = new MapController(mapService);

    req = {
      user: { id: userMock.users[0].id } as User,
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('getOne', () => {
    beforeEach(() => {
      mapService.getOne.mockResolvedValue({
        status: 200,
        data: mapMock.maps[0],
      });
    });

    it('should return a map by its id', async () => {
      req.params = { id: mapMock.maps[0].id };

      await mapController.getOne(req as Request, res as Response, next);

      expect(mapService.getOne).toHaveBeenCalledWith(
        mapMock.maps[0].id,
        userMock.users[0].id,
      );
      expect(res.json).toHaveBeenCalledWith(mapMock.maps[0]);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Should return an error when mapId is missing', async () => {
      await mapController.getOne(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        message: MAP_ID_MISSING_MESSAGE,
      });
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getAll', () => {
    it('Should return an array of maps', async () => {
      mapService.getAll.mockResolvedValue({
        status: 200,
        data: mapMock.maps,
      });

      await mapController.getAll(req as Request, res as Response, next);

      expect(mapService.getAll).toHaveBeenCalledWith(userMock.users[0].id);
      expect(res.json).toHaveBeenCalledWith(mapMock.maps);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      mapService.create.mockResolvedValue({
        status: 201,
        data: mapMock.maps[0],
      });
    });

    it('Should create a new map', async () => {
      const map = mapMock.maps[0];
      const mapData = map.data;
      const mapVisibility = map.visibility;
      req.body = {
        data: mapData,
        visibility: mapVisibility,
      };

      await mapController.create(req as Request, res as Response, next);

      expect(mapService.create).toHaveBeenCalledWith(
        mapData,
        mapVisibility,
        userMock.users[0].id,
      );
      expect(res.json).toHaveBeenCalledWith(map);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('Should return an error when map data is invalid', async () => {
      for (const invalidData of mapMock.invalidData) {
        req.body = {
          data: invalidData,
          visibility: mapMock.maps[0].visibility,
        };

        await mapController.create(req as Request, res as Response, next);

        expect(res.status).toHaveBeenLastCalledWith(400);
        expect(res.json).toHaveBeenLastCalledWith({
          message: MAP_DATA_MISSING_MESSAGE,
        });
      }
      expect(res.json).toHaveBeenCalledTimes(mapMock.invalidData.length);
      expect(res.status).toHaveBeenCalledTimes(mapMock.invalidData.length);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      mapService.update.mockResolvedValue({
        status: 200,
        data: { message: MAP_UPDATED_MESSAGE },
      });
    });

    it('Should update a map', async () => {
      req.params = { id: mapMock.maps[0].id };
      req.body = {
        data: mapMock.maps[0].data,
        visibility: mapMock.maps[0].visibility,
      };

      await mapController.update(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ message: MAP_UPDATED_MESSAGE });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Should return an error when id is invalid', async () => {
      req.body = {
        data: undefined,
        visibility: mapMock.maps[0].visibility,
      };
      await mapController.update(req as Request, res as Response, next);

      expect(res.json).toHaveBeenLastCalledWith({
        message: MAP_ID_MISSING_MESSAGE,
      });
      expect(res.status).toHaveBeenLastCalledWith(400);

      req.params = { id: '' };
      req.body = {
        data: mapMock.maps[0].data,
        visibility: mapMock.maps[0].visibility,
      };
      await mapController.update(req as Request, res as Response, next);

      expect(res.json).toHaveBeenLastCalledWith({
        message: MAP_ID_MISSING_MESSAGE,
      });
      expect(res.status).toHaveBeenLastCalledWith(400);
    });

    it('Should return an error when data is invalid', async () => {
      req.params = { id: mapMock.maps[0].id };

      for (const invalidData of mapMock.invalidData) {
        req.body = {
          data: invalidData,
          visibility: mapMock.maps[0].visibility,
        };
        await mapController.update(req as Request, res as Response, next);
        expect(res.json).toHaveBeenLastCalledWith({
          message: MAP_DATA_MISSING_MESSAGE,
        });
        expect(res.status).toHaveBeenLastCalledWith(400);
      }
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mapService.delete.mockResolvedValue({
        status: 200,
        data: { message: MAP_DELETED_MESSAGE },
      });
    });

    it('Should delete a map', async () => {
      req.params = { id: mapMock.maps[0].id };

      await mapController.delete(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ message: MAP_DELETED_MESSAGE });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('Should return an error when id is invalid', async () => {
      req.params = { id: '' };

      await mapController.delete(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        message: MAP_ID_MISSING_MESSAGE,
      });
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
