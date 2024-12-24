import express, { Request, Response } from "express";
import SecondApp from './secondApp'
import { Hero } from './secondApp'
import cors from "cors";
const port = 3000;
const app: express.Express = express();
const secondAppInstance = new SecondApp();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// GET, POST, PUT and DELETE routers
app.get('/api/getall', (req: Request, res: Response) =>{
    secondAppInstance.createTables();
    secondAppInstance.runQueries();
    console.log(`-------------------Heroes------------------`)
});

app.post('/api/post', (req: Request, res: Response) =>{
    const heroes: Hero[] = req.body;
    secondAppInstance.createTables();
    secondAppInstance.insertRows(heroes);
    console.log(`Heroes added`);
});
// edit hero by id
app.put('/api/put/:id', (req: Request, res: Response) =>{
    const { id } = req.params;
    const { hero_name, is_xman, was_snapped } = req.body;
    const updatedHero: Hero = {
        hero_id: Number(id),
        hero_name,
        is_xman,
        was_snapped
    };
    secondAppInstance.editHero(updatedHero);
    console.log(`Hero with id ${id} edited!`);
});
// delete hero by id
app.delete('/api/put/:id', (req: Request, res: Response) =>{
    const { id } = req.params;
    const hero_id = Number(id)
    secondAppInstance.deleteHero(hero_id);
    console.log(`Hero with id ${id} deleted!`);
});

app.delete('/api/deletetable', (req: Request, res: Response) =>{
    secondAppInstance.deleteTable();
    console.log(`Table named hero deleted!`);
});

app.listen(port,() =>{
    console.log('server is open!');
});
