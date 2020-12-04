const express = require('express');
const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'exercise-tracker';


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
                        console.log('successfully inserted a new user: ' + result);
                        collection.findOne({username: userName}, (err,data) => {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('successfully fetched the user\'s id');
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
    let duration = req.body.duration;
    let date = req.body.date;
    
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
                        {_id:userId}, 
                        { $push : { log: add_exercise } }, (err,data) =>{
                        if(err){
                            console.log(err);
                        } else {
                            res.json({ _id: data._id, username: data.username, date: data.date, duration: data.duration, description: data.description });
                        }
                    })
                   
                }

                Access(client, () => client.close());
            }
        })
    }
})




// /api/exercise/log?{userId}[&from][&to][&limit]
// res.json({ _id: , username: , count: , log: (description:, duration, date) })

module.exports = router;