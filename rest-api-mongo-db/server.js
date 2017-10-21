// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var http = require('http');
var fs = require('fs');
var https = require('https');
var app = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5555;        // set our port
var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
var Bear = require('./app/models/bear');

var TModel = require('./app/models/tin');
var TRawModel = require('./app/models/tinraw');

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/tin')
    .post(function(req, res){
        var tModel = new TModel();
        //console.log(req.body);
        try {
            tModel.name = req.body.name;
            tModel.info = req.body.info;
            tModel.bio = req.body.bio;
            tModel.pics = req.body.pics;
    
            //console.log(JSON.stringify(tModel));
    
            tModel.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    "message": "created"
                })
            });
    
            // tModel.save((err, appt) => {
            //     console.log("CALLED")
            //     if (err) {
            //       return next(err);
            //     }
            
            //     res.json(appt);
            //   });
        } catch(ex){
            console.log("ERROR : ", ex)
        }
        
    }).get(function(req,res){
        res.json({"message": "welcome to tin api"})
    });

    router.route('/tinraw')
    .post(function(req, res){
        var tModel = new TRawModel();
        tModel.name = req.body.name;
        tModel.info = req.body.info;
        tModel.bio = req.body.bio;
        tModel.pics = req.body.pics;
        tModel.obj = req.body.obj;
    
        tModel.save(function(err){
            if(err){
                res.send(err);
            }
            res.json({
                "message" : "created"
            })
        })
    }).get(function(req,res){
        res.json({"message": "welcome to tinraw api"})
    });;

// more routes for our API will happen here
router.route('/bears')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function (req, res) {

        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });

    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    .put(function(req, res) {
        
                // use our bear model to find the bear we want
                Bear.findById(req.params.bear_id, function(err, bear) {
        
                    if (err)
                        res.send(err);
        
                    bear.name = req.body.name;  // update the bears info
        
                    // save the bear
                    bear.save(function(err) {
                        if (err)
                            res.send(err);
        
                        res.json({ message: 'Bear updated!' });
                    });
        
                });
            })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.get('/home', function (req, res) {
    res.send("Welcome");
});

var credentials = {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8'),
    passphrase: 'softwares'
}

// START THE SERVER
// =============================================================================
https.createServer(credentials, app).listen(port);

console.log('Magic happens on port ' + port);