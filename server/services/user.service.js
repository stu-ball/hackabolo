var Q = require('q');
require('dotenv').config();
var jwtDecode = require('jwt-decode');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var sha256 = require('sha256');
var md5 = require('md5');
var mongoosePaginate = require('mongoose-paginate');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: false,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: false,
        lowercase: true,
        index: true
    },
    firstName: String,
    lastName: String,
    mobile: String,
    picture: String,
    createdAt: {
        type: Date,
        index: true
    },
    inactive: Boolean
});

userSchema.virtual('name').get(function () {
    if (this.firstName && this.lastName) {
        return this.firstName + ' ' + this.lastName;
    } else {
        return this.username;
    }

});

userSchema.virtual('sub').get(function () {
    return 'hackabolo|' + this._id;
});

userSchema.virtual('identities').get(function () {

    var user_identities = [{
        'user_id': this._id,
        'provider': 'hackabolo',
        'connection': 'database',
        'isSocial': false
    }];
    return user_identities;
});

userSchema.plugin(mongoosePaginate);

var User = mongoose.model('User', userSchema);

var service = {};

service.signup = signup;
service.login = login;
service.createAdminUser = createAdminUser;
service.decodeToken = decodeToken;
service.createUserToken = createUserToken;
service.User = User;

module.exports = service;

function decodeToken(authorization) {
    var deferred = Q.defer();

    authorization = _.replace(authorization, 'bearer ', '');
    authorization = _.replace(authorization, 'Bearer ', '');

    try {
        var authTokenPayload = jwtDecode(authorization);
        authTokenPayload.isUser = true;

        const roles = authTokenPayload.roles;
        if (roles.includes('admin')) authTokenPayload.isAdmin = true;
        if (roles.includes('boloCreator')) authTokenPayload.isBoloCreator = true;
        if (roles.includes('broadcastCreator')) authTokenPayload.isBroadcastCreator = true;
        if (roles.includes('boloApprover')) authTokenPayload.isBoloApprover = true;
        if (roles.includes('broadcastApprover')) authTokenPayload.isBroadcastApprover = true;
        deferred.resolve(authTokenPayload);
    } catch (ex) {
        deferred.reject();
    }

    return deferred.promise;
}

function signup(userCredentials, roles) {
    var deferred = Q.defer();
    var passedCheck = true;

    // Make sure username, password and email fields are not empty
    if (typeof userCredentials.username == 'undefined' ||
        typeof userCredentials.password == 'undefined' ||
        typeof userCredentials.email == 'undefined') {
        passedCheck = false;
        deferred.reject('Username, Email, Password required');
    } else {
        passedCheck = true;
    }

    // Make sure password is at least PASSWORD_LENGTH characters long
    if (typeof userCredentials.password != 'undefined') {
        if (userCredentials.password.length < process.env.PASSWORD_LENGTH) {
            passedCheck = false;
            deferred.reject('Password must be at least ' + process.env.PASSWORD_LENGTH + ' characters long.');
        } else {
            passedCheck = true;
        }
    }

    if (passedCheck) {
        const passwordHash = sha256(process.env.SECRET + userCredentials.password);
        const username = _.toLower(userCredentials.username);
        const email = _.toLower(userCredentials.email);
        const picture = 'https://www.gravatar.com/avatar/' + md5(email);
        const now = Date.now();
        var newUser = new User(userCredentials);
        newUser.username = username;
        newUser.password = passwordHash;
        newUser.email = email;
        newUser.picture = picture;
        newUser.createdAt = now;
        newUser.roles = roles;
        newUser.save(function (err, user) {
            if (err) {
                console.log(err.name + ': ' + err.message);
                deferred.reject(err.name + ': ' + err.message);
            }
            deferred.resolve(user);
        });
    }

    return deferred.promise;
}

function login(username, password) {
    var deferred = Q.defer();

    const passwordHash = sha256(process.env.SALT + password);
    username = _.toLower(username);

    User.findOne({
        username: username,
        password: passwordHash
    },
    function (err, user) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }

        if (user) {
            if (user.inactive) {
                deferred.reject('Account disabled');
            } else {
                deferred.resolve(user);
            }
        } else {
            deferred.reject('Wrong password or username');
        }

    });

    return deferred.promise;
}

// This function creates the admin user
function createAdminUser() {
    var deferred = Q.defer();
    console.log('User Service: createAdminUser');
    var newAdminUser = new User({
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        password: sha256(process.env.SECRET + process.env.ROOTPW),
        email: 'noreply@noemail.com',
        createdAt: Date.now(),
        roles: ['user', 'boloCreator', 'broadcastCreator', 'boloApprover', 'broadcastApprover', 'admin']
    });
    newAdminUser.save(function (err, results) {
        if (err) {
            console.log(err.name + ': ' + err.message);
            deferred.reject(err.name + ': ' + err.message);
        }
        console.log('User service: Admin user created: ', results);
        deferred.resolve(results);
    });

    return deferred.promise;
}

function createUserToken(user) {
    var deferred = Q.defer();

    const now = parseInt(Date.now() / 1000);
    const expires_in = parseInt(process.env.TOKEN_USER_EXPIRY);
    const expires_at = now + expires_in;

    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.name,
        mobile: user.mobile,
        roles: user.roles,
        picture: user.picture,
        identities: user.identities,
        updatedAt: user.updatedAt,
        sub: user.sub,
        aud: process.env.OAUTH_CLIENT_ID,
        iss: 'https://hackabolo.local',
        iat: now,
        exp: expires_at
    };

    jwt.sign(payload, process.env.OAUTH_CLIENT_SECRET, function (err, token) {

        if (err) deferred.reject('Token create failed');

        if (token) {
            deferred.resolve({
                token: token,
                payload: payload,
                expiresIn: expires_in
            });
        } else {
            deferred.reject('Token create failed');
        }

    });

    return deferred.promise;

}