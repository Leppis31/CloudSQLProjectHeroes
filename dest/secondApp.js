"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = require("sqlite3");
dotenv_1.default.config();
const app = (0, express_1.default)();
const secondAppPort = 3002;
// CORS should work as asked I think
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (origin && origin === process.env.ALLOWED_ORIGIN) {
            callback(null, true);
        }
        else {
            callback(new Error(`access denied, only usable from ${process.env.ALLOWED_ORIGIN}`));
        }
    }
}));
// Creating/using db
const dbfile = process.env.DBFILE ? process.env.DBFILE : "./src/default.sql";
let db = new sqlite3_1.Database(dbfile, (err) => {
    if (err) {
        console.log("Error occurred while connecting to the database");
        return;
    }
});
// Class that contains table creation, row insertion, row editing/deleting by ID, table deletion, and printing table contents.
class SecondApp {
    createTables() {
        db.exec(`
        create table if not exists hero(
            hero_id int primary key,
            hero_name text,
            is_xman text,
            was_snapped text
        );`, (err) => {
            if (err) {
                console.log(`Error ${err} occurred when creating table`);
                throw err;
            }
        });
    }
    insertRows(heroes) {
        heroes.forEach((hero) => {
            db.run(`INSERT INTO hero (hero_id, hero_name, is_xman, was_snapped) VALUES (?, ?, ?, ?);`, [hero.hero_id, hero.hero_name, hero.is_xman, hero.was_snapped], (err) => {
                if (err) {
                    console.log(`Error ${err} when inserting to table`);
                    throw err;
                }
            });
        });
    }
    editHero(hero) {
        db.run(`UPDATE hero SET hero_name = ?, is_xman = ?, was_snapped = ? WHERE hero_id = ?;`, [hero.hero_name, hero.is_xman, hero.was_snapped, hero.hero_id], (err) => {
            if (err) {
                console.log(`Error ${err} when editing hero`);
                throw err;
            }
        });
    }
    deleteHero(id) {
        db.run(`DELETE FROM hero WHERE hero_id = ?;`, id, (err) => {
            if (err) {
                console.log(`Error ${err} when editing hero`);
                throw err;
            }
        });
    }
    deleteTable() {
        db.exec(`DROP TABLE hero`, (err) => {
            if (err)
                throw err;
        });
    }
    runQueries() {
        db.all('select * from hero', [], (err, rows) => {
            if (err)
                throw err;
            rows.forEach(row => {
                console.log(`id: ${row.hero_id} name: ${row.hero_name} is_xman: ${row.is_xman} was_snapped: ${row.was_snapped}`);
            });
        });
    }
}
app.listen(secondAppPort, () => {
    console.log(`First app is 3000 and second is ${secondAppPort}`);
});
exports.default = SecondApp;
