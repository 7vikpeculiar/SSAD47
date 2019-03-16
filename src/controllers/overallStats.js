'use strict';
var express = require('express')
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose')

var db = require('../db.js');
var overallStats = require('../models/overallStats');
var Lead = require('../models/lead');
var User = require('../models/user');
var Organisation = require('../models/organisation');
var overallStats = require('../models/overallStats');
var Summary = mongoose.model('OverallStats');

var ObjectId = require('mongoose').Types.ObjectId;

require('../models/user');
require('../models/lead');
require('../models/organisation');
// Check the users company and also his admin status
var UserModel = mongoose.model('User');
var OrganisationModel = mongoose.model('Organisation');
var OverallStatsModel = mongoose.model('OverallStats');
router.get('/overallStats',function(req,res)
{
  //console.log(req);
  var org_id = req.user.organisation;
  // console.log(req.user.id);
  // console.log('Org_id is',org_id);
  // check user is logged in
  OverallStatsModel.findOne({"organisation":ObjectId(org_id)},function (err, overall_stats) {
    if (err) {
     return res.send(JSON.stringify('Unsuccessful'), {'Content-Type': 'application/json'}, 500);
    }
    if (overall_stats==null){
      overall_stats={}
    }
    console.log('returninig stats',overall_stats)
    return res.json(overall_stats);
  });
});


//var query = { campaign`xx ` ObjectId(campaign._id) };
//var a = getoverallStats({"user_id": ObjectId('59e47c952899eb8264191954')});
//user id :58f5e59027f0485a3c02632a
//company id :58ecaa247f49d84207b53082
module.exports = router;
