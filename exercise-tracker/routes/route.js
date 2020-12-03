const express = require('express');
const app = express();
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'exercise-tracker';



router.post('/new-user', function(req,res) {
    let userName = req.body.username;

    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
        if(err) {
            console.log(err);
        } else {
            console.log('connected to API: \'/api/exercise/new-user\'');
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



// /api/exercise/new-user POST, save username, log(array)
// res.json({ username: , _id: })


// /api/exercise/add POST, find a user by userId, add values into log
// res.json({ _id: , username: , date: , duration: , description: })


// /api/exercise/log?{userId}[&from][&to][&limit]
// res.json({ _id: , username: , count: , log: (description:, duration, date) })

module.exports = router;