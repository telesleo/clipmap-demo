import Map from '../../database/models/Map';
import MapService from '../../services/map.service';
import {
  INVALID_MAP_VISIBILITY_MESSAGE,
  MAP_DELETED_MESSAGE,
  MAP_NOT_FOUND_MESSAGE,
  MAP_UPDATED_MESSAGE,
} from '../../utils/response-messages';
import {
  serializeJsonString,
  deserializeJsonString,
} from '../../utils/json-optimizer';
import * as mapMock from '../mocks/map.mock';
import * as userMock from '../mocks/user.mock';

jest.mock('../../database/models/Map', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));
jest.mock('../../utils/json-optimizer', () => ({
  serializeJsonString: jest.fn(),
  deserializeJsonString: jest.fn(),
}));

describe('Map Service', () => {
  let mapService: MapService;

  beforeEach(() => {
    mapService = new MapService(Map);
    jest.clearAllMocks();
  });

  describe('getOne', () => {
    it('Should return a map by its id', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });
      (deserializeJsonString as jest.Mock).mockReturnValue(
        mapMock.deserializedData[0],
      );

      const response = await mapService.getOne(
        mapMock.maps[0].id,
        mapMock.maps[0].userId,
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        ...mapMock.maps[0],
        data: mapMock.deserializedData[0],
      });
    });

    it('Should return a map by its id when map visibility is public', async () => {
      const mapWithPublicVisibility = {
        ...mapMock.maps[0],
        visibility: 'public',
      };

      (Map.findOne as jest.Mock).mockResolvedValue(mapWithPublicVisibility);
      (deserializeJsonString as jest.Mock).mockReturnValue(
        mapMock.deserializedData[0],
      );

      const response = await mapService.getOne(
        mapMock.maps[0].id,
        userMock.invalidId,
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual(mapWithPublicVisibility);
    });

    it('Should return an error when map id is invalid', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue(null);

      const response = await mapService.getOne(
        mapMock.invalidId,
        mapMock.maps[0].userId,
      );
      expect(response.status).toBe(404);
      expect(response.data).toEqual({ message: MAP_NOT_FOUND_MESSAGE });
    });

    it('Should return an error when userId is invalid and map visibility is private', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });
      (deserializeJsonString as jest.Mock).mockReturnValue(
        mapMock.deserializedData[0],
      );

      const response = await mapService.getOne(
        mapMock.maps[0].id,
        userMock.invalidId,
      );
      expect(response.status).toBe(404);
      expect(response.data).toEqual({ message: MAP_NOT_FOUND_MESSAGE });
    });
  });

  describe('getAll', () => {
    it('Should return an array of maps', async () => {
      (Map.findAll as jest.Mock).mockResolvedValue([...mapMock.maps]);
      (deserializeJsonString as jest.Mock).mockReturnValueOnce(
        mapMock.deserializedData[0],
      );
      (deserializeJsonString as jest.Mock).mockReturnValueOnce(
        mapMock.deserializedData[1],
      );
      (deserializeJsonString as jest.Mock).mockReturnValueOnce(
        mapMock.deserializedData[2],
      );

      const response = await mapService.getAll(mapMock.maps[0].userId);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        mapMock.maps.map((map, index) => ({
          ...map,
          data: mapMock.deserializedData[index],
        })),
      );
    });

    it('Should return an empty array', async () => {
      (Map.findAll as jest.Mock).mockResolvedValue([]);

      const response = await mapService.getAll(userMock.invalidId);
      expect(response.status).toBe(200);
      expect(response.data).toEqual([]);
    });
  });

  describe('create', () => {
    it('Should create a new map', async () => {
      (Map.create as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });
      (serializeJsonString as jest.Mock).mockResolvedValue(
        mapMock.maps[0].data,
      );

      const response = await mapService.create(
        mapMock.deserializedData[0],
        mapMock.maps[0].visibility,
        mapMock.maps[0].userId,
      );
      expect(response.status).toBe(201);
      expect(response.data).toEqual({
        id: mapMock.maps[0].id,
        data: mapMock.deserializedData[0],
        visibility: mapMock.maps[0].visibility,
        createdAt: mapMock.maps[0].createdAt,
        updatedAt: mapMock.maps[0].updatedAt,
      });
    });

    it('Should return an error when visibility is invalid', async () => {
      const response = await mapService.create(
        mapMock.deserializedData[0],
        mapMock.invalidVisibility,
        mapMock.maps[0].userId,
      );
      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: INVALID_MAP_VISIBILITY_MESSAGE,
      });
    });
  });

  describe('update', () => {
    it('Should update a map', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });
      (serializeJsonString as jest.Mock).mockResolvedValue(
        mapMock.maps[0].data,
      );

      const response = await mapService.update(
        mapMock.maps[0].userId,
        mapMock.maps[0].id,
        mapMock.deserializedData[0],
        mapMock.maps[0].visibility,
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: MAP_UPDATED_MESSAGE,
      });
    });

    it('Should return an error when map is not found', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue(null);

      const response = await mapService.update(
        mapMock.maps[0].userId,
        mapMock.invalidId,
        mapMock.deserializedData[0],
        mapMock.maps[0].visibility,
      );
      expect(response.status).toBe(404);
      expect(response.data).toEqual({
        message: MAP_NOT_FOUND_MESSAGE,
      });
    });

    it('Should return an error when userId is invalid', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });

      const response = await mapService.update(
        userMock.invalidId,
        mapMock.maps[0].id,
        mapMock.deserializedData[0],
        mapMock.maps[0].visibility,
      );
      expect(response.status).toBe(404);
      expect(response.data).toEqual({
        message: MAP_NOT_FOUND_MESSAGE,
      });
    });

    it('Should return an error when visibility is invalid', async () => {
      const response = await mapService.update(
        mapMock.maps[0].userId,
        mapMock.maps[0].id,
        mapMock.deserializedData[0],
        mapMock.invalidVisibility,
      );
      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        message: INVALID_MAP_VISIBILITY_MESSAGE,
      });
    });
  });

  describe('delete', () => {
    it('Should delete a map', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue({ ...mapMock.maps[0] });

      const response = await mapService.delete(
        mapMock.maps[0].userId,
        mapMock.maps[0].id,
      );
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: MAP_DELETED_MESSAGE });
    });

    it('Should return an error when mapId is invalid', async () => {
      (Map.findOne as jest.Mock).mockResolvedValue(null);

      const response = await mapService.delete(
        mapMock.maps[0].userId,
        mapMock.maps[0].id,
      );
      expect(response.status).toBe(404);
      expect(response.data).toEqual({ message: MAP_NOT_FOUND_MESSAGE });
    });
  });
});
