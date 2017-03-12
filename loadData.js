const fs = require('fs')
const glob = require('glob')
const MongoClient = require('mongodb').MongoClient
const async = require('async')

const dbName = process.argv[2]

MongoClient.connect(`mongodb://localhost:27017/${dbName}`, function(err, db) {
	
	if (err)
		throw err

	console.log('connected')

	db.collection('series').remove()

	glob('Data/*.json', function(err, files) {

		const queue = async.queue(function(file, callback) {
			console.log(file)
			fs.readFile(file, function(err, content) {
				db.collection('series').insert(JSON.parse(content), callback)
			})
		})
		queue.drain = function() {
			console.log('Done')
			process.exit()
		}
		queue.push(files)

	})

})