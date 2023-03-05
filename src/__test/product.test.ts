import supertest from "supertest";
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { addProductToDB } from "../services/product.service";
import { createServer } from "../utils/server";

const app = createServer();

const productPayload = {
    product_id: uuidv4(),
    name: 'TSIRT VIP CODE STUDIO RED21',
    price: 1000,
    size: 'L UP'
}

describe('product', () => {

        beforeAll(async() => {
            const mongoServer = await MongoMemoryServer.create()
            await mongoose.connect(mongoServer.getUri())
        }); 

        afterAll(async () => {
            await mongoose.disconnect()
            await mongoose.connection.close()
        });
        
        // describe('get all product', () => {
        //     describe('given the return 200 and detail product data', async() => {
        //         const { statusCode, body } = await supertest(app).get(`/product`)
        //         expect(statusCode).toBe(200);
        //     });
        // });

        describe('get detail product', async() => {

            describe('given the product does not exist', () => {

                it('should return 404, and empty data', async () => {
                    const productId = 'PRODUCT_123';
                    const { statusCode } = await supertest(app).get(`/product/${productId}`).expect(404);
                    await supertest(app).get(`/product/${productId}`).expect(404)
                });

                it('should return 200, and detail product data', async () => {   
                    const productId1 =  await addProductToDB(productPayload); 
                    const { statusCode, body } = await supertest(app).get(`/product/${productId1}`);
                    expect(statusCode).toBe(200);
                    expect(body.data.name).toBe("Your Tshirt Size Large Up");
                });
            })  
        })

        describe('create product', async() => {
            describe('if user not authorized', async() => {
                it('should return 403, request forbiden', async () => {
                    const { statusCode } = await supertest(app).post('/product').send(productPayload);
                    expect(statusCode).toBe(403);
                });
            });

            describe('if user authorized', async() => {
                it('should return 201, success create product', async () => {
                    const { statusCode, body } = await supertest(app).post('/product').send(productPayload);
                    console.log(body.data);
                    expect(statusCode).toBe(201);
                });
            });
        });

    }
)
