import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import sqlite3, { Database } from 'sqlite3'
dotenv.config()
const app = express();
const secondAppPort = 3002;

// CORS should work as asked I think
app.use(cors({
    origin: function (origin, callback) {
      if (origin && origin === process.env.ALLOWED_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error(`access denied, only usable from ${process.env.ALLOWED_ORIGIN}`));
      }
    }
}));

export interface Hero{
    hero_id:number,
    hero_name:string,
    is_xman:string,
    was_snapped:string
}
// Creating/using db
const dbfile:string = process.env.DBFILE ? process.env.DBFILE : "./src/default.sql"
let db: Database = new Database(dbfile, (err:Error|null) => {
    if(err){
        console.log("Error occurred while connecting to the database")
        return
    }
})
// Class that contains table creation, row insertion, row editing/deleting by ID, table deletion, and printing table contents.
class SecondApp{
    createTables(): void{
        db.exec(`
        create table if not exists hero(
            hero_id int primary key,
            hero_name text,
            is_xman text,
            was_snapped text
        );`
        ,(err:Error|null) =>{
            if(err){
                console.log(`Error ${err} occurred when creating table`)
                throw err
            }
        })
    }

    insertRows(heroes: Hero[]): void{
        heroes.forEach((hero)=>{
            db.run(
                `INSERT INTO hero (hero_id, hero_name, is_xman, was_snapped) VALUES (?, ?, ?, ?);`,
                [hero.hero_id, hero.hero_name, hero.is_xman, hero.was_snapped]
                ,(err:Error|null) =>{
                    if(err){
                        console.log(`Error ${err} when inserting to table`)
                        throw err
                    }
                })
            })
        }
    editHero(hero: Hero): void{
            db.run(
                `UPDATE hero SET hero_name = ?, is_xman = ?, was_snapped = ? WHERE hero_id = ?;`,
                [hero.hero_name, hero.is_xman, hero.was_snapped, hero.hero_id]
                ,(err:Error|null) =>{
                    if(err){
                        console.log(`Error ${err} when editing hero`)
                        throw err
                    }
            })
    }
    deleteHero(id:number):void{
        db.run(
            `DELETE FROM hero WHERE hero_id = ?;`,
            id
            ,(err:Error|null) =>{
                if(err){
                    console.log(`Error ${err} when editing hero`)
                    throw err
                }
        })
    }
    deleteTable():void{
        db.exec(
            `DROP TABLE hero`,
            (err:Error|null)=>{
                if(err) throw err
            }
        )
    }

    runQueries(): void{
        db.all('select * from hero', [], (err:Error|null,rows:Hero[]) =>{
            if(err) throw err
            rows.forEach(row =>{
                console.log(`id: ${row.hero_id} name: ${row.hero_name} is_xman: ${row.is_xman} was_snapped: ${row.was_snapped}`)
            })
        })
    }
}

app.listen(secondAppPort, () => {
    console.log(`First app is 3000 and second is ${secondAppPort}`);
});

export default SecondApp;