var Q = require('q');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;

var BoloSchema = mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true,
        default: 'All'
    }, 
    status: String,
    type: String,
    subType: String,
    offence: String,
    location: String,
    contact: String,
    images: [String],
    urgent: Boolean,
    validFrom: {
        type: Date, 
        default: Date.now
    },
    validTo: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        index: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date,
        default: Date.now
    },
    inactive: {
        type: Boolean,
        default: false,
        index: true
    }
});



var Bolo = mongoose.model('Bolo', BoloSchema);

var service = {};

service.createBolo = createBolo;
service.delete = _delete;
service.list = list;
service.read = read;
service.update = update;
service.search = search;
service.disable = disable;

service.Bolo = Bolo;

module.exports = service;

function createBolo(doc) {
    var deferred = Q.defer();
    var now = new Date();
    doc.createdAt = now;
    doc.createdById = doc.createdBy;

    if (typeof doc.details == 'undefined' || doc.details == null || doc.details == '') deferred.reject('details required');
    /**
     * TODO: Add additional field validation
     */

    var newObject = new Bolo(doc);
    newObject.save(function (err, results) {
        if (err) return deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(results); // returns new object
    });

    return deferred.promise;
}

function read(id) {
    var deferred = Q.defer();

    Bolo.findOne({
        '_id': id
    })
        .populate('createdBy', '_id username')
        .populate('updatedBy', '_id username')
        .exec(function (err, results) {
            if (err) {
                console.log(err.name + ': ' + err.message);
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function list() {
    var deferred = Q.defer();

    Bolo.find()
        .sort({
            'createdAt': -1
        })
        .populate('createdBy', '_id username')
        .populate('updatedBy', '_id username')
        .exec(function (err, results) {
            if (err) {
                console.log(err.name + ': ' + err.message);
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

function update(id, doc) {
    var deferred = Q.defer();

    Bolo.findOne({
        '_id': id
    }, function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (results) {
            if (typeof doc.details != 'undefined') results.details = doc.details;
            if (typeof doc.subject != 'undefined') results.subject = doc.subject;
            if (typeof doc.updatedBy != 'undefined') results.updatedBy = doc.updatedBy;
            /**
             * TODO: Add the additional fields to be updated based on the schema
             */
            results.updatedAt = Date();
            results.save(function (err, object) {
                if (err) return deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(object);
            });
        } else {
            deferred.reject('No record found');
        }
    });
    return deferred.promise;
}

function _delete(id) {
    var deferred = Q.defer();

    Bolo.remove({
        '_id': id
    }, function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }
        deferred.resolve(results);
    });

    return deferred.promise;
}

function disable(id, updatedBy) {
    var deferred = Q.defer();

    Bolo.findOne({
        '_id': id
    }, function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (results) {
            results.inactive = true;
            results.updatedBy = updatedBy;
            results.updatedAt = Date();
            results.save(function (err, object) {
                if (err) return deferred.reject(err.name + ': ' + err.message);
                deferred.resolve(object);
            });
        } else {
            deferred.reject('No record found');
        }
    });
    return deferred.promise;
}

function search(query) {
    var deferred = Q.defer();
    if (typeof query.inactive == 'undefined') query.inactive = false;

    Bolo.find(query)
        .sort({
            'createdAt': -1
        })
        .exec(function (err, results) {
            if (err) {
                console.log(err.name + ': ' + err.message);
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve(results);
        });

    return deferred.promise;
}

