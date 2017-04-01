const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
var db

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

//lancement du server avec mongodb directement
MongoClient.connect('mongodb://regular:regularesilv1@ds145750.mlab.com:45750/nosql_project', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000 and connected to mongodb')
  })
})

//home - root file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//doc
app.get('/doc', (req, res) => {
	res.sendFile(__dirname + '/doc.html')
})

//[APPROUVED]
//pour AJOUTER un document à mondodb 
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('element saved to database')
    res.render('ajout.ejs');
  })
})

//[APPROUVED]
//pour afficher la liste des quotes
app.get('/getquotes', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('resultats.ejs', {quotes: result})
  })
})

//[APPOUVED]
//pour récupérer une quote spécifique
app.post('/getquotesSname', (req,res) => {
	db.collection('quotes').find({name:req.body.name}).toArray((err, result) => {
		if(err) return console.log(err)
		res.render('resultats.ejs', {quotes: result})
	})
})
//[WORK IN PROGRESS ...]
app.post('/getquotesScontent', (req,res) => {
	db.collection('quotes').find({name:req.body.quote}).toArray((err, result) => {
		if(err) return console.log(err)
		res.render('fail.ejs')
	})
})

//[WORK IN PROGRESS ...]
//Requête personnalisée
app.post('/setrqt', (req, res) => {
	/*
	db.collection('quotes').find(req.body.rqt).toArray((err, result) => {
    if (err) return res.render('error.ejs')
    // renders index.ejs
    res.render('resultats.ejs', {quotes: result})

  })*/
  res.render('fail.ejs');
})

//[APPROUVED]
//Suppression quote
app.post('/delQuote', (req, res) => {
	var MongoObjectID = require("mongodb").ObjectID;          // Il nous faut ObjectID
	var idToFind      = req.body.id;                          // Identifiant, sous forme de texte
	var objToFind     = { _id: new MongoObjectID(idToFind) }; // Objet qui va nous servir pour effectuer la recherche

	db.collection('quotes').remove(objToFind, null, function(error, result) {
    if (error) throw error;
    res.render('ajout.ejs')
	});
})

//[APPROUVED]
//maj quote
app.post('/majQuote', (req,res) => {
	var MongoObjectID = require("mongodb").ObjectID;          // Il nous faut ObjectID
	var idToFind      = req.body.id;                          // Identifiant, sous forme de texte
	var objToFind     = { _id: new MongoObjectID(idToFind) }; // Objet qui va nous servir pour effectuer la recherche

	db.collection('quotes').update(objToFind, {$set:{quote: req.body.quote}}, function(err, result) {
    if (err) {
    	console.log(err)
    	res.render('error.ejs')
    }
	});
	db.collection('quotes').find(objToFind).toArray((err, result) => {
		if(err) return console.log(err)
		res.render('resultats.ejs', {quotes: result})
	})
})

