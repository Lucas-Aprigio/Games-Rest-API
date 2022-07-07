const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const Game = require('./games/Game');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(()=>{
        console.log("Database connection established!");
    }).catch(err => {
        console.log(err);
    });


app.get("/games", (req,res)=>{
    Game.findAll({
        attributes: ['id', 'title', 'year', 'price']
    }).then(games=>{
        res.statusCode = 200;
        res.json(games);
    });  
});

app.get("/game/:id", (req,res)=>{
    if (isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        let id = parseInt(req.params.id);
        Game.findOne({
            where: {id:id},
            attributes: ['id', 'title', 'year', 'price']
        }).then((game)=>{
            if (game != undefined){
                res.statusCode = 200;
                res.json(game);
            }else{
                res.sendStatus(404);
            }
        }).catch(err=>{
            console.log(err);
        })     
    }
});

app.post("/game", (req,res)=>{
        let {title, price, year} = req.body;

        if(isNaN(price && year)){
            res.sendStatus(400);

        }else if(title && price && year != undefined){
            Game.create({
                title: title,
                year:year,
                price: price
            }).then(()=>{
                res.sendStatus(200);
            });       
        }else{
            res.sendStatus(400);
        }  
});   


app.delete("/game/:id", (req,res)=>{
    if (isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        let id = parseInt(req.params.id);
        Game.destroy({
            where: {id:id}
        }).then((game)=>{
            if (game == 1){
                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }    
        }).catch((err)=>{
            console.log(err);
        })
        
    }  
});

app.put("/game/:id", (req,res)=>{
    if (isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        let id = parseInt(req.params.id);
        Game.findOne({
            where: {id:id},
            attributes: ['id', 'title', 'year', 'price']
        }).then((game)=>{
            if (game != undefined){
                let {title, price, year} = req.body;

                if(title != undefined){
                    game.update({title:title}
                    )}
                if(price != undefined){
                    game.update({price:price}
                    )}
                if(year != undefined){
                    game.update({year:year}
                    )}
                res.statusCode = 200;
                res.json(game);
            }else{
                res.sendStatus(404);
            }
        }).catch(err=>{
            console.log(err);
        })     
    }
});

app.listen(8080, ()=>{
    console.log("API running on port 8080");
});
