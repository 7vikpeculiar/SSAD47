var mongoose = require('mongoose');
var async = require('async');

var SalesPipelineStats = require('../models/salesPipelineStats');
var Lead = require('../models/lead');
var organistaion = require('../models/organisation.js');
var db = require('../db.js');
var LeadStage = require('../models/leadStage.js');

var Lead = mongoose.model('Lead');
var salesPipelineStats = mongoose.model('salesPipelineStats');
var Organisation = mongoose.model('Organisation');
var LeadStage = mongoose.model('LeadStage');

var salesPipelineData = {};


exports.computePipelineStats = function(orgs,callback3)
{
	orgs.forEach(function(orgID){
	LeadStage.find({'organisation' : orgID}, function(err,stages)
	{
		//console.log(stages);

		// async.eachSeries(stages, function (stage, callback) {
		// 	wrapper(stage._id, function(err,finalVal){........+
			
		// 		// salesPipelineData['lostPer'] = next_per;
		// 		// console.log(salesPipelineData['lostPer']);
		// 		// callback(null,salesPipelineData);
		// 		orgPipelineList.push(finalVal);
		// 	})
  //       	//callback();
  //       },function(){return callback(err,orgPipelineList);});
        async.eachSeries(stages, function (stage, callback) {
			wrapper(stage._id, function(err,salesPipelineData){
				// salesPipelineData['lostPer'] = next_per;
				// console.log(salesPipelineData['lostPer']);
				// callback(null,salesPipelineData);
				//console.log(salesPipelineData);
				var salesPipelineDoc = new salesPipelineStats({organisation: orgID, stage: stage._id, stageName: salesPipelineData['stageName'], numberOfDeals: salesPipelineData['numDeals'],
				totalDealsValue: salesPipelineData['totalVal'], dealReachPercent: salesPipelineData['reachStagePer'],
				dealNextPercent: salesPipelineData['nextStagePer'], dealLostPercent: salesPipelineData['lostPer']});
			salesPipelineDoc.save((function(err){
				if(err)
				{
					console.log(err);
				}
				//console.log("Model successfully added");
			}))
				 callback();
			});
		},
		function(err){
			//console.log(orgPipelineList, '\n\n');
		});
        	//callback();
       //function(){return callback(err,orgPipelineList);});
		// stages.forEach(function(stage)
		// {
		// 	wrapper(stage._id)
		// 	//console.log(stageName);
		// });	
		// return callback(stages);
	});
	});
};

var wrapper2 = function(orgID,callback3)
{
	
	LeadStage.find({'organisation' : orgID}, function(err,stages)
	{
		var orgPipelineList=[];
		//console.log(stages);

		// async.eachSeries(stages, function (stage, callback) {
		// 	wrapper(stage._id, function(err,finalVal){........+
			
		// 		// salesPipelineData['lostPer'] = next_per;
		// 		// console.log(salesPipelineData['lostPer']);
		// 		// callback(null,salesPipelineData);
		// 		orgPipelineList.push(finalVal);
		// 	})
  //       	//callback();
  //       },function(){return callback(err,orgPipelineList);});
        async.eachSeries(stages, function (stage, callback) {
			wrapper(stage._id, function(err,salesPipelineData){
				// salesPipelineData['lostPer'] = next_per;
				// console.log(salesPipelineData['lostPer']);
				// callback(null,salesPipelineData);
				//console.log(salesPipelineData);
				var salesPipelineDoc = new salesPipelineStats({organisation: orgID, stage: stage._id, stageName: salesPipelineData['stageName'], numberOfDeals: salesPipelineData['numDeals'],
				totalDealsValue: salesPipelineData['totalVal'], dealReachPercent: salesPipelineData['reachStagePer'],
				dealNextPercent: salesPipelineData['nextStagePer'], dealLostPercent: salesPipelineData['lostPer']});
			salesPipelineDoc.save((function(err){
				if(err)
				{
					console.log(err);
				}
				//console.log("Model successfully added");
			}))
				 callback();
			});
		},
		function(err){
			//console.log(orgPipelineList, '\n\n');
		});
        	//callback();
       //function(){return callback(err,orgPipelineList);});
		// stages.forEach(function(stage)
		// {
		// 	wrapper(stage._id)
		// 	//console.log(stageName);
		// });	
		// return callback(stages);
	});
};

var stageNameFunc = function(stageId,callback)
{
	LeadStage.findById(stageId,function(err,stage)
	{
		if(err){
			//console.log(err);
			return callback(err);
		}
		//console.log(org);
		//salesPipelineData['stageName'] = org.name;
		//console.log(finalData['stageName']);
		return callback(err,stage.name);
	});
};	

var sortIdFunc = function(stageId,callback)
{
	LeadStage.findById(stageId, function(err,org)
	{
		if(err){
			//console.log(err);
			return callback(err);
		}
		//console.log(org);
		//salesPipelineData['sortId'] = org.sort_id;
		return callback(err,org.sort_id);
	});
};

var numOfDeals = function(stageId, callback)
{
	// LeadStage.findById(stageId, function(err,tot)
	// {
	// 	//console.log(tot)
	// 	//salesPipelineData['numDeals'] = tot.length;
	// 	if(err){
	// 		//console.log(err);
	// 		return callback(err);
	// 	}
		//console.log(finalData['numDeals']);
		Lead.find({'stage': stageId},function(err,leads)
		{
			//console.log(err,leads);
			if(err){
				//console.log(err);
				return callback(err);
			}
			return callback(err,leads.length);
		});
	// });
};

//Error as of now , need to use aggr-sum mongoose fuction
var totalDealVal = function(stageId,callback)
{
	 var totalVal = 0;
	// LeadStage.findById(stageId, function(err,leadStage)
	// {
	// 	//console.log(tot);
	// 	if(err){
	// 		//console.log(err);
	// 		return callback(err);
	// 	}
		Lead.find({'stage': stageId},function(err,leads)
		{
			//console.log(err,leads);
			if(err){
				//console.log(err);
				return callback(err);
			}
			leads.forEach(function(lead)
			{
				totalVal+=lead.deal_value;
				//console.log(totalVal);		
			});
			return callback(err,totalVal);
		});
	// });
	//console.log(totalVal);
};

var reachStageFunc = function(stageId, sortId, callback)
{
	var stagePer,stageDeal,totalDeal;
	/*LeadStage.find({$or: [{'name': result},{'sort_id': {$gte: id}}]},function(err,per)
	{
		//console.log(per);
		stageDeal = per.length;
		console.log(stageDeal);
		stagePer = (stageDeal/totalDeal)*100;
		console.log(stagePer);
	});*/
	Lead.find({},function(err,allLeads)
	{
		//console.log('per',allLeads);
		if(err){
			//console.log(err);
			return callback(err);
		}
		totalDeal = allLeads.length
		//console.log(totalDeal);
		LeadStage.find({$or: [{'_id': stageId}, {'sort_id': {$gte: sortId}}]},function(err,filteredLeads)
		{
			//console.log('filteredLeads',filteredLeads);
			if(err){
			//console.log(err);
				return callback(err);
			}
			stageDeal = filteredLeads.length;
			//console.log(stageDeal);
			stagePer = (stageDeal/totalDeal)*100;
			//salesPipelineData['reachStagePer'] = stagePer;
			//console.log(finalData['reachStagePer']);
			return callback(err,stagePer);
		});
	});
};

var nextStageFunc = function(stageId, sortId, callback)
{
	var nextStagePer,stageDeal,totalNext;	
	LeadStage.find({$or: [{'_id': stageId}, {'sort_id': {$gte: sortId}}]},function(err, allStageDeals)
	{
		//console.log(per);
		if(err){
			//console.log(err);
			return callback(err);
		}
		stageDeal = allStageDeals.length;
		//console.log(stageDeal);
		LeadStage.find({'sort_id': {$gt: sortId}},function(err, nextStageDeals)
		{
			//console.log(stageDeal);
			//console.log(per);
			if(err){
			//console.log(err);
				return callback(err);
			}
			totalNext = nextStageDeals.length
			//console.log(totalNext);
			nextStagePer = (totalNext/stageDeal)*100;
			//salesPipelineData['nextStagePer'] = nextStagePer;
			//console.log(finalData['nextStagePer']);
			return callback(err, nextStagePer);
		});
	});
};

var lostDealPer = function(stageId,callback)
{
	var lostPer;
	Lead.find({'stage': stageId},function(err,leads)
	{
		//console.log(err,leads);
		if(err){
			//console.log(err);
			return callback(err);
		}
		var total = leads.length;
		//console.log(total);
		Lead.find({$and: [{'stageId': stageId}, {'status': 'Lost'}]},function(err, lostDeals)
		{
			if(err){
				//console.log(err);
				return callback(err);
			}
			var lost = lostDeals.length;
			//console.log(lost);
			lostPer = (lost/total)*100;
			return callback(err,lostPer);
		});
	});
};

//change stage_id to lead_id leadId
var wrapper = function(stageId,callback2)
{	
	async.waterfall([
		function(callback){
			stageNameFunc( stageId, function(err,org_name){
				salesPipelineData['stageName'] = org_name;
				//console.log(salesPipelineData['stageName']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			sortIdFunc( stageId, function(err,org_sort_id){
				salesPipelineData['sortId'] = org_sort_id;
				//console.log(salesPipelineData['sortId']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			numOfDeals(stageId, function(err,org_deal_num){
				salesPipelineData['numDeals'] = org_deal_num;
				//console.log(salesPipelineData['numDeals']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			totalDealVal(stageId, function(err,org_deal_num){
				salesPipelineData['totalVal'] = org_deal_num;
				//console.log(salesPipelineData['totalVal']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			reachStageFunc(stageId, salesPipelineData['sortId'], function(err,reach_per){
				salesPipelineData['reachStagePer'] = reach_per;
				//console.log(salesPipelineData['reachStagePer']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			nextStageFunc(stageId, salesPipelineData['sortId'], function(err,next_per){
				salesPipelineData['nextStagePer'] = next_per;
				//console.log(salesPipelineData['nextStagePer']);
				callback(null,salesPipelineData);
			})
		},
		function(salesPipelineData,callback){
			lostDealPer(stageId, function(err,next_per){
				salesPipelineData['lostPer'] = next_per;
				//console.log(salesPipelineData['lostPer']);
				callback(null,salesPipelineData);
			})
		}
	],
	function(err,salesPipelineData){
		return callback2(err,salesPipelineData);
	});
};

var ObjectId = require('mongoose').Types.ObjectId;
//wrapper({"_id": ObjectId('58afc55fe1badc37ee0817f6')});
//console.log(salesPipelineData);vijayendra.shenoy@gmrgroup.com
//stageNameFunc2( '58afc55fe1badc37ee0817f2');
// stageNameFunc2('58afc55fe1badc37ee0817f2', function(err,finalVal){
// 	console.log(finalVal);
// })

//WE CAN CALL THE FUNCTIONS USING WRAPPER2 AND WRAPPER3 WHICH IN-TURN CALLS WRAPPER
// wrapper2('58afc55fe1badc37ee0817f2', function(err,finalVal){
// 	console.log(finalVal);
// })

// Replace computePipelineStats export the topmost function to wrapper3 and call wrapper3 
// itself for overallstats of an array of orgId's

// computePipelineStats(['58afc55fe1badc37ee0817f2','58afc55fe1badc37ee0817f2'], function(err,finalVal){
// 	console.log(finalVal);
// })

// WILL BE PRESENT IN YOUR MODEL(BELOW 7 FUNCS)
// stageNameFunc('58afc55fe1badc37ee0817f6', function(err,totalVal){
// 	console.log(totalVal);
// })
// sortIdFunc('58afc55fe1badc37ee0817f6', function(err,totalVal){
// 	console.log(totalVal);
// })
// numOfDeals('58afc55fe1badc37ee0817f6', function(err,totalVal){
// 	console.log(totalVal);
// })
// totalDealVal( '58afc55fe1badc37ee0817f6', function(err,totalVal){
// 	console.log(totalVal);
// } )
// reachStageFunc('58afc55fe1badc37ee0817f6',4,function(err,reach_per){
// 	console.log(reach_per);
// })
// nextStageFunc('58afc55fe1badc37ee0817f6',4,function(err,next_per){
// 	console.log(next_per);
// })
// lostDealPer( '58afc55fe1badc37ee0817f6', function(err,totalVal){
// 	console.log(totalVal);
// } )