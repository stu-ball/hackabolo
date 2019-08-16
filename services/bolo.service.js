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
    categories: [String],
    subCategory: String,
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

BoloSchema.virtual('image').get(function () {
    if (this.images.length > 0) {
        return this.images[0];
    } else {
        return '';
    }
    
});

var Bolo = mongoose.model('Bolo', BoloSchema);
/* const m2s = require('mongoose-to-swagger');
const swaggerSchema = m2s(Bolo);
console.log('BOLO Model');
console.log(JSON.stringify(swaggerSchema)); */
var service = {};

service.create = createBolo;
service.delete = _delete;
service.list = list;
service.read = read;
service.update = update;
service.search = search;
service.disable = disable;
service.approve = approve;

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

    Bolo.updateOne({
        '_id': id
    },doc, function (err, results) {
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

    Bolo.find(query, '-images')
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

function approve(id, approvedBy) {
    var deferred = Q.defer();

    Bolo.findOne({
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