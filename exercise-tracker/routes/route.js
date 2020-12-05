const express = require('express');
const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'exercise-tracker';
const ObjectId = require('mongodb').ObjectID;


// /api/exercise/new-user POST, save username, log(array)
// res.json({ username: , _id: })
router.post('/new-user', function(req,res) {
    let userName = req.body.username;

    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
        if(err) {
            console.log(err);
        } else {
            let collection = client.db(dbName).collection('users');

            const Access = (client, callback) => {
                let new_user = {
                    username: userName,
                    log: []
                }
                collection.insertOne(new_user, (err,result) => {
                    if(err) {
                        console.log(err);
                    } else {
                        collection.findOne({username: userName}, (err,data) => {
                            if(err) {
                                console.log(err);
                            } else {
                                res.json({ username: data.username, _id: data._id })
                            }
                        })
                    }
                })
            }

            // 이게 콜백을 이용해서 동기화시키는 방법인가?
            Access(client, function() {
                client.close()
            })

        }
    })
})


// /api/exercise/add POST, find a user by userId, add values into log
// res.json({ _id: , username: , date: , duration: , description: })
router.post('/add', function(req, res) {
    let userId = req.body.userId;
    let desc = req.body.description;
    let duration = parseInt(req.body.duration);
    let date = Date(req.body.date);
    
    if(userId.length == 0 || desc.length == 0 || duration.length == 0) {
        res.send("Please enter a value to REQUIRED items");
    } else {
        if(date.length == 0){
            date = Date();              
        }
        MongoClient.connect(url, {useUnifiedTopology: true}, function(err,client) {
            if(err) {
                console.log(err);
            } else {
                let collection = client.db(dbName).collection('users');

                const Access = (client, callback) => {

                    let add_exercise = {
                        description: desc,
                        duration: duration,
                        date: date
                    }

                    collection.updateOne(
                        {'_id':ObjectId(userId)},   // solved by <require('mongodb').ObjectID()> !!
                        {'$push': { 'log' :add_exercise }}, 
                        function(err, data){
                            if(err){
                                console.log(err)
                            } else {
                                collection.findOne({'_id':ObjectId(userId)},(err,data) =>{
                                    if (err){
                                        console.log(err)
                                    } else {
                                        res.json({ _id: userId, username: data.username, date: date, duration: duration, description: desc});
                                    }
                                })
                            }
                        }
                    )
                        
                }

                Access(client, () => client.close());
            }
        })
    }
})




// /api/exercise/log?{userId}[&from][&to][&limit]
// res.json({ _id: , username: , count: , log: (description:, duration, date) })

module.exports = router;