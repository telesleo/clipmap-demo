import { users } from './user.mock';

const maps = [
  {
    id: '3ae96396-641c-4d50-8d8d-d321004777f3',
    data: '[{"i":0,"n":"Main Node","c":[1,2,6]},{"i":1,"n":"Node 1","c":[5],"r":1},{"i":2,"n":"Node 2","c":[3,4],"r":1},{"i":3,"n":"Sub Node 1"},{"i":4,"n":"Sub Node 2"},{"i":5,"n":"Other Node"},{"i":6,"n":"Node 3","r":0}]',
    userId: users[0].id,
    visibility: 'private',
    createdAt: '2024-05-30 11:50:27.228+00',
    updatedAt: '2024-05-30 11:50:27.228+00',
  },
  {
    id: '999cdebc-2557-4cd1-8f61-0971e09bb065',
    data: '[{"i":0,"n":""}]',
    userId: users[0].id,
    visibility: 'public',
    createdAt: '2024-06-30 11:50:27.228+00',
    updatedAt: '2024-06-30 11:50:27.228+00',
  },
  {
    id: '086b3e3e-f8ee-4216-b2db-964eaa0c7d5e',
    data: '[{"i":0,"n":"Map Name"}]',
    userId: users[0].id,
    visibility: 'private',
    createdAt: '2024-07-30 11:50:27.228+00',
    updatedAt: '2024-07-30 11:50:27.228+00',
  },
];

const invalidId = '29ccd840-8202-4e80-937d-2d394f839066';

const deserializedData = [
  '[{"id":0,"name":"Main Node","children":[1,2,6]},{"id":1,"name":"Node 1","children":[5],"rightBranch":true},{"id":2,"name":"Node 2","children":[3,4],"rightBranch":true},{"id":3,"name":"Sub Node 1"},{"id":4,"name":"Sub Node 2"},{"id":5,"name":"Other Node"},{"id":6,"name":"Node 3","rightBranch":false}]',
  '[{"id":0,"name":""}]',
  '[{"id":0,"name":"Map Name"}]',
];

const invalidVisibility = 'invalid';

const invalidData = [30, {}, undefined, null];

export { maps, invalidId, deserializedData, invalidVisibility, invalidData };
