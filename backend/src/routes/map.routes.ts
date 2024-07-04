import express from 'express';
import checkAuth from '../middlewares/checkAuth';
import MapService from '../services/map.service';
import Map from '../database/models/Map';
import MapController from '../controllers/map.controller';

const router = express.Router();

const mapService = new MapService(Map);
const mapController = new MapController(mapService);

router.get('/', checkAuth, mapController.getAll.bind(mapController));
router.get('/:id', checkAuth, mapController.getOne.bind(mapController));
router.post('/', checkAuth, mapController.create.bind(mapController));
router.patch('/:id', checkAuth, mapController.update.bind(mapController));
router.delete('/:id', checkAuth, mapController.delete.bind(mapController));

export default router;
