import Map from '../database/models/Map';
import IServiceResponse from '../interfaces/IServiceResponse';
import {
  INVALID_MAP_VISIBILITY_MESSAGE,
  MAP_DELETED_MESSAGE,
  MAP_NOT_FOUND_MESSAGE,
  MAP_UPDATED_MESSAGE,
} from '../utils/response-messages';
import {
  serializeJsonString,
  deserializeJsonString,
} from '../utils/json-optimizer';

const FIELDS_INCLUDED = ['id', 'data', 'createdAt', 'updatedAt'];

export default class MapService {
  constructor(private model: typeof Map) {}

  static deserializeMap = (map: Map) => {
    map.data = deserializeJsonString(map.data);
    return map;
  };

  async getAll(userId: string): Promise<IServiceResponse> {
    const maps = await this.model.findAll({
      where: { userId },
      attributes: { include: FIELDS_INCLUDED },
    });
    const mapsDeserialized = maps.map((map) => MapService.deserializeMap(map));
    return { status: 200, data: mapsDeserialized };
  }

  async getOne(mapId: string, userId: string): Promise<IServiceResponse> {
    const map = await this.model.findOne({
      where: { id: mapId },
      attributes: { include: FIELDS_INCLUDED },
    });
    if (!map || (map.userId !== userId && map.visibility === 'private')) {
      return { status: 404, data: { message: MAP_NOT_FOUND_MESSAGE } };
    }
    const mapDeserialized = MapService.deserializeMap(map);
    return { status: 200, data: mapDeserialized };
  }

  async create(
    data: string,
    visibility: string,
    userId: string,
  ): Promise<IServiceResponse> {
    const mapVisibility = visibility || 'private';
    if (!['private', 'public'].includes(mapVisibility)) {
      return {
        status: 400,
        data: { message: INVALID_MAP_VISIBILITY_MESSAGE },
      };
    }
    const optimizedData = serializeJsonString(data);
    const map = await this.model.create({
      data: optimizedData,
      visibility: mapVisibility,
      userId,
    });
    return {
      status: 201,
      data: {
        id: map.id,
        data: map.data,
        visibility: map.visibility,
        createdAt: map.createdAt,
        updatedAt: map.updatedAt,
      },
    };
  }

  async update(
    userId: string,
    id: string,
    newData: string,
    newVisibility: string | undefined,
  ): Promise<IServiceResponse> {
    const visibility = newVisibility || 'private';
    if (!['private', 'public'].includes(visibility)) {
      return {
        status: 400,
        data: { message: INVALID_MAP_VISIBILITY_MESSAGE },
      };
    }
    const map = await this.model.findOne({ where: { id } });
    if (!map || map.userId !== userId) {
      return { status: 404, data: { message: MAP_NOT_FOUND_MESSAGE } };
    }
    const optimizedData = serializeJsonString(newData);
    await this.model.update(
      {
        data: optimizedData,
        visibility: visibility || 'private',
      },
      { where: { id } },
    );
    return {
      status: 200,
      data: {
        message: MAP_UPDATED_MESSAGE,
      },
    };
  }

  async delete(userId: string, id: string): Promise<IServiceResponse> {
    const map = await this.model.findOne({ where: { userId, id } });
    if (!map) {
      return { status: 404, data: { message: MAP_NOT_FOUND_MESSAGE } };
    }
    await this.model.destroy({ where: { userId, id } });
    return {
      status: 200,
      data: { message: MAP_DELETED_MESSAGE },
    };
  }
}
