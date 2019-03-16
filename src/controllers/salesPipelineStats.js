'use strict';
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var async = require('async')

var salesPipelineStats = require('../models/salesPipelineStats')
var User = require('../models/user');
var LeadStage = require('../models/leadStage');
var Lead = require('../models/lead');
var Organisation = require('../models/organisation');

var ObjectId = require('mongoose').Types.ObjectId;

var UserModel = mongoose.model('User');
var OrganisationModel = mongoose.model('Organisation');
var salesPipelineStatsModel = mongoose.model('salesPipelineStats');
var LeadStageModel = mongoose.model('LeadStage');
var LeadModel = mongoose.model('Lead');

router.get('/salesPipelineStats',function(req,res)
{
	var org_id = req.user.organisation;
	salesPipelineStatsModel.find({"organisation": ObjectId(org_id)},function (err, salesPipeline_Stats){
		if (err) {
     		return res.send(JSON.stringify('Unsuccessful'), {'Content-Type': 'application/json'}, 500);
    	}
    	if (salesPipeline_Stats == null){
      		salesPipeline_Stats = {}
    	}
    	console.log('returning stats',salesPipeline_Stats);
    	// MyModel.aggregate([
     //        {$match: {$and: [{created_date: {$gte: start_date}}, {created_date: {$lte: end_date}}]}},
     //        {$group: {
     //            _id: {
     //                year: {$year: "$created_at"},
     //                month: {$month: "$created_at"},
     //                day: {$dayOfMonth: "$created_at"}
     //            },
     //            count: {$sum: 1}
     //        }},
     //        {$project: {
     //            date: {
     //                    year: "$_id.year",
     //                    month:"$_id.month",
     //                    day:"$_id.day"
     //            },
     //            count: 1,
     //            _id: 0
     //        }}
     //    ], callback);
     // console.log(salesPipeline_Stats);
    // 	salesPipeline_Stats.aggregate([
    // 		{
    // 			$group:{
    // 				_id: {stage : salesPipeline_Stats[i].stage},

    // 			}
    // 			$sort:{

    // 			}
    // 		}
    // 	],function (err, result) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         res.json(result);
    //     }
    // });
    	return res.json(salesPipeline_Stats);
	});
});

module.exports = router;