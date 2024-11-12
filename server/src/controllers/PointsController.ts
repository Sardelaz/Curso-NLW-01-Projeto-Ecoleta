import { Request, Response } from 'express';
import knex from '../database/connection';

// Definindo o CustomError fora da função
class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CustomError"; // Nome da classe de erro personalizada
    }
}

class PointsController {

    // Método para listar os pontos
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;
    
        console.log('Parâmetros recebidos na API:', { city, uf, items });
    
        const parsedItems = String(items)
          .split(',')
          .map(item => Number(item.trim()));
    
        console.log('Items parsed:', parsedItems);
    
        try {
          const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

            const serializedPoint = points.map(point => {
                return {
                    ...point,
                    image_url : `http://192.168.15.110:3333/uploads/${point.image}`,
                };
            });
        
    
          console.log('Pontos encontrados:', points);
    
          return response.json(serializedPoint);
        } catch (error) {
          console.error('Erro na consulta de pontos:', error);
          return response.status(500).json({
            message: 'An error occurred while fetching points.',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
    }

    // Método para mostrar detalhes do ponto
    async show(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const point = await knex('points').where('id', id).first();

            if (!point) {
                return response.status(404).json([{ message: 'Point not found' }]);
            }

            const serializedPoint = {
                ...point,
                image_url : `http://192.168.15.110:3333/uploads/${point.image}`,
            };
        

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id)
                .select('items.title');

            return response.json({ point: serializedPoint, items });    
        } catch (error) {
            return response.status(500).json({
                message: 'Error fetching point details.',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    // Método para criar um ponto
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        console.log('Corpo da requisição:', request.body);
    
        const trx = await knex.transaction();
    
        try {
            // Verifica se todos os campos obrigatórios estão preenchidos
            if (!name || !email || !whatsapp || !latitude || !longitude || !city || !uf || !items) {
                console.error('Campos obrigatórios ausentes:', { name, email, whatsapp, latitude, longitude, city, uf, items });
                return response.status(400).json({ message: "All fields are required" });
            }
    
            const point = {
                image: request.file?.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };
    
            const insertedIds = await trx('points').insert(point);
            const point_id = insertedIds[0];
    
            const pointItems = String(items)
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((item_id: number) => {
                    return {
                        item_id,
                        point_id,
                    };
                });
    
            // Insere os pointItems e loga os itens criados
            await trx('point_items').insert(pointItems);
    
            console.log('Items criados:', pointItems);
    
            await trx.commit();
    
            return response.json({
                id: point_id,
                ...point,
            });
        } catch (error) {
            await trx.rollback();
            console.error('Erro no processamento:', error);
            return response.status(500).json({
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    
    
}

export default PointsController;
