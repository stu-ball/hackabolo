var Q = require('q');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;

var BroadcastSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    type: String,
    urgent: Boolean,
    validFrom: {
        type: Date,
        default: Date.now
    },
    validTo: {
        type: Date,
        default: new Date(+new Date() + 365 * 24 * 60 * 60 * 1000)
    }, // 1 year by default,
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
    },
    approved: {
        type: Boolean,
        default: false,
        index: true
    }
});



var Broadcast = mongoose.model('Broadcast', BroadcastSchema);
/* const m2s = require('mongoose-to-swagger');
const swaggerSchema = m2s(Broadcast);
console.log('Broadcast Model');
console.log(JSON.stringify(swaggerSchema)); */

var service = {};

service.create = createBroadcast;
service.delete = _delete;
service.list = list;
service.read = read;
service.update = update;
service.search = search;
service.disable = disable;
service.approve = approve;

service.Broadcast = Broadcast;

module.exports = service;

function createBroadcast(doc) {
    var deferred = Q.defer();
    var now = new Date();
    doc.createdAt = now;
    doc.createdById = doc.createdBy;

    if (typeof doc.content == 'undefined' || doc.content == null || doc.content == '') deferred.reject('content required');
    /**
    * TODO: Add additional field validation
    */

    var newObject = new Broadcast(doc);
    newObject.save(function (err, results) {
        if (err) return deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(results); // returns new object
    });

    return deferred.promise;
}

function read(id) {
    var deferred = Q.defer();

    Broadcast.findOne({
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

    Broadcast.find()
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

    Broadcast.updateOne({
        '_id': id
    }, doc, function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (results) {
            deferred.resolve(results);
        } else {
            deferred.reject('No record found');
        }
    });
    return deferred.promise;
}

function _delete(id) {
    var deferred = Q.defer();

    Broadcast.remove({
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

    Broadcast.findOne({
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

function approve(id, approvedBy) {
    var deferred = Q.defer();

    Broadcast.findOne({
        '_id': id
    }, function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (results) {
            results.approved = true;
            results.updatedBy = approvedBy;
            results.approvedBy = approvedBy;
            results.updatedAt = Date();
            results.approvedAt = Date();
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

    Broadcast.find(query)
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
