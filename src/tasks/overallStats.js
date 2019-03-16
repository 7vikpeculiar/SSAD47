const mongoose = require('mongoose');
var async = require('async');
mongoose.Promise = global.Promise
var db = require('../db.js');
var overallStats = require('../models/overallStats');
var Lead = require('../models/lead');
var User = require('../models/user');
var Organisation = require('../models/organisation');
var logger = require('../log');

var Lead = mongoose.model('Lead');
var User = mongoose.model('User');
var Summary = mongoose.model('OverallStats');
var Organisation = mongoose.model('Organisation');
var ObjectId = require('mongoose').Types.ObjectId;

var findDays = function(date1,date2)
{
  // Find no. of days between date1 and date2
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  //console.log(typeof(date1));
  var diffDays = Math.abs((date1 - date2)/(oneDay));
  return diffDays;
};

var orgComputeSummary = function(data,callback){
      org_id = ObjectId(data);
      console.log('Started calculating for', org_id);
        Lead.find({organisation : org_id}, function (err,leads)
        {
          //console.log(leads);

        var deal_count = 0;
        var deal_val = 0;
        var deal_time = 0;
        if(leads.length == 0)
        {
          console.log('No Leads Found')
          var stats = {totalDeals :0, totalDealValue: 0, averageClosureTime: 0};
          Summary.findOneAndUpdate({organisation: org_id},stats,{upsert: true, new: true, runValidators: true},function(err,doc){
            if(err){
                console.log(err);
            } else
            {
              console.log('Upserted Doc',doc);
              console.log('Ended calculating stats for ',doc.organisation);
              callback(doc.organisation);
            }
          });
        }
            console.log('Leads exist for',org_id);
          leads.forEach(function(lead)
          {
              if(lead.deal_value > 0)
              {
                deal_val += lead.deal_value;
                deal_count +=1;
                var start_time = (lead.createdAt > 0) ? lead.createdAt : Date.now();
                var end_time =  (lead.pipelineOutTime > 0 ) ? lead.pipelineOutTime : Date.now();
                deal_time += findDays(start_time,end_time);
              }

          });
          avg_closure_time = Math.round((deal_count > 0) ? (deal_time / deal_count) : 0);
        //  console.log('Type of avg_closure_time',typeof(avg_closure_time));
        //  console.log(deal_val,deal_count,avg_closure_time);

    var stats = {organisation: org_id,totalDeals :deal_count, totalDealValue: deal_val, averageClosureTime: avg_closure_time};
    Summary.findOneAndUpdate({organisation: org_id},stats,{upsert: true, new: true, runValidators: true},function(err,doc){
      if(err){
          console.log(err);
          callback(err);
      } else
      {
        console.log('Upserted Doc',doc);
        console.log('Ended calculating stats for ',doc.organisation);
        callback(null,doc.organisation);
      }
    });
});
};

allOrganisationStats = function(callback){
        console.log('Calculating stats for all orgs');
        Organisation.find({}, function(err, orgs)
        {
          //var response=0;
          async.eachSeries(orgs,function(org,callback)
          {
              var org_id = org._id;
              orgComputeSummary(org_id,function(err,saved_org_id){
              //  response+=1;
              if(err)
              {
                logger.error(err);
                callback(err);
              }
                console.log('saved company data for org:',saved_org_id);
                //if(response  === length) {
                  //foreach work done
                  //return;
                  callback();
              });
            },function(){console.log('Calculations done');});
          });
              console.log('Ended Stats for all orgs');

};


//var query = { campaign_id: new ObjectId(campaign._id) };
//orgComputeSummary('59fb1d5bdba99cec6a33590d',function(){console.log('Done');});
//allOrganisationStats();
exports.allOrganisationStats = allOrganisationStats;
