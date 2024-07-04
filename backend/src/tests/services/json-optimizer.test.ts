import {
  deserializeJsonString,
  serializeJsonString,
} from '../../utils/json-optimizer';
import * as mapMock from '../mocks/map.mock';

describe('JsonOptimizer', () => {
  it('Should return deserialized json string', () => {
    const deserlizedJsonString = deserializeJsonString(mapMock.maps[0].data);
    expect(deserlizedJsonString).toEqual(mapMock.deserializedData[0]);
  });

  it('Should return serialized json string', () => {
    const deserlizedJsonString = serializeJsonString(
      mapMock.deserializedData[0],
    );
    expect(deserlizedJsonString).toEqual(mapMock.maps[0].data);
  });
});
