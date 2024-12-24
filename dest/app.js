"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const secondApp_1 = __importDefault(require("./secondApp"));
const cors_1 = __importDefault(require("cors"));
const port = 3000;
const app = (0, express_1.default)();
const secondAppInstance = new secondApp_1.default();
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// GET, POST, PUT and DELETE routers
app.get('/api/getall', (req, res) => {
    secondAppInstance.createTables();
    secondAppInstance.runQueries();
    console.log(`-------------------Heroes------------------`);
});
app.post('/api/post', (req, res) => {
    const heroes = req.body;
    secondAppInstance.createTables();
    secondAppInstance.insertRows(heroes);
    console.log(`Heroes added`);
});
// edit hero by id
app.put('/api/put/:id', (req, res) => {
    const { id } = req.params;
    const { hero_name, is_xman, was_snapped } = req.body;
    const updatedHero = {
        hero_id: Number(id),
        hero_name,
        is_xman,
        was_snapped
    };
    secondAppInstance.editHero(updatedHero);
    console.log(`Hero with id ${id} edited!`);
});
// delete hero by id
app.delete('/api/put/:id', (req, res) => {
    const { id } = req.params;
    const hero_id = Number(id);
    secondAppInstance.deleteHero(hero_id);
    console.log(`Hero with id ${id} deleted!`);
});
app.delete('/api/deletetable', (req, res) => {
    secondAppInstance.deleteTable();
    console.log(`Table named hero deleted!`);
});
app.listen(port, () => {
    console.log('server is open!');
});
