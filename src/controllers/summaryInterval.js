var express = require('express')
var router = express.Router();
var async = require('async');
var mongoose = require('mongoose')

var user = require('../models/user');
require('../models/leadStage');
require('../models/lead');
require('../models/organisation');
var SummaryInterval = require('../models/summaryInterval')
var ObjectId = require('mongoose').Types.ObjectId;

var UserModel = mongoose.model('User');
var summaryIntervalModel = mongoose.model('SummaryInterval');

router.get('/summaryInterval',function(req,res)
{
  var orgID = req.user.organisation;
    // console.log("hi");

    // summaryIntervalModel.find({organisation: {'$in':org, '$exists': true}}, null,function (err, result)
    summaryIntervalModel.find({"organisation": orgID}, function(err,summary_interval){
      if (err)
      {
        return res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 500);
      }
      if(summary_interval == null){
        console.log("lol");
        summary_interval = {} // summary_interval is the result received
      }
      console.log("orgid ",orgID);
      console.log("type",typeof(orgID));
      console.log("Returning result", summary_interval);
      return res.json(summary_interval);
    })
    ;
});

module.exports = router;
