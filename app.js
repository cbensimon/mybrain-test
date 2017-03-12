const async = require('async')
const MongoClient = require('mongodb').MongoClient
const express = require('express')
const app = express()

const port = 3005
const dbName = process.argv[2]

MongoClient.connect(`mongodb://localhost:27017/${dbName}`, function(err, db) {

	if (err)
		throw err

	console.log('connected')

	app.use(express.static('public'))
	app.use(require('body-parser').json())

	app.post('/retrieveData', function(req, res) {

		const user_id = req.body.userId
		const tags = req.body.tags

		if (user_id) {
			db.collection('series').find({user_id}, {
				_id: false,
				data: true
			}).toArray(function(err, docs) {
				if (err)
					throw err
				res.send(docs)
			})
		} else if (tags) {
			db.collection('series').find({
				tags: {$in: tags}
			}, {
				_id: false,
				data: true
			}).toArray(function(err, docs) {
				if (err)
					throw err
				res.send(docs)
			})
		}else {
			res.send({
				error: 'no field'
			})
		}
	})

	app.get('/forms', function(req, res) {
		async.parallel({
			userIds: function(callback) {
				db.collection('series').distinct('user_id', callback)
			},
			tags: function(callback) {
				db.collection('series').distinct('tags', callback)
			}
		}, function(err, formFields) {
			if (err)
				throw err
			res.send(formFields)
		})
	})

	app.listen(port)
	console.log(`app running on port ${port}`)

})