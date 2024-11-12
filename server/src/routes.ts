import express, { Request, Response } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/points', async (request: Request, response: Response) => {
    try {
        await pointsController.index(request, response);
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

routes.get('/points/:id', async (request: Request, response: Response) => {
    try {
        await pointsController.show(request, response);
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

routes.get('/items', async (request: Request, response: Response) => {
    try {
        await itemsController.index(request, response);
    } catch (error) {
        response.status(500).json({ message: 'Internal Server Error' });
    }
});

routes.post(
    '/points',
    upload.single('image'),
    celebrate(
        {
            [Segments.BODY]: Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().required().email(),
                whatsapp: Joi.number().required(),
                latitude: Joi.number().required(),
                longitude: Joi.number().required(),
                city: Joi.string().required(),
                uf: Joi.string().required().max(2),
                items: Joi.string().required(),
            }),
        },
        { abortEarly: false } 
    ),
    async (request: Request, response: Response) => {
        try {
            await pointsController.create(request, response);
        } catch (error) {
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

export default routes;
