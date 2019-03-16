
  // add wrapper for overall stats and pipeline

  var mongoose = require('mongoose');
  var async = require('async');

  var db = require('../db.js');
  var SummaryInterval = require('../models/summaryInterval');
  require('../models/lead');
  require('../models/salesUserStats');
  require('../models/user');
  var user = mongoose.model('User');

  var lead = mongoose.model('Lead');
  var SummaryInterval = mongoose.model('SummaryInterval');
  // var numberNewDealsFunc;

var computeMonthAgoDate = function()
{
  var d = new Date();
  d.setDate(d.getDate()-300);
  console.log(d);
  return d;
} // end of function that computes date 1 month ago
// computeMonthAgoDate();
  // var numOfDeals;
exports.computeSummaryInterval = function(orgID,callback1){
    async.waterfall([
        function(callback)
          {
            // number of new deals added
            var finalData={};
            var before30days = computeMonthAgoDate();

              lead.aggregate([
                {
                  $group :{
                    _id: {organisation : orgID._id},
                    count: {$sum:
                      { $cond:{if:
                    { $lte: [before30days,"$time_stamp"] },
                        then: 1,
                        else:0
                      }
                    }
                  } // end of sum
                  }
                }
              ], function(err,value){
                if(err)
                console.log(err);
                else {
                  finalData['numberNewDeals'] = value[0].count;
                  callback(null, finalData, before30days);
                }
              }) // end of aggregate
          }, // end of numberNewDealsFunc function

          function(finalData,before30days,callback)
          {
            lead.aggregate([
              {
                $group: {
                  _id: {organisation : orgID._id},
                  totVal: {$sum:
                    { $cond:{if:
                  { $lte: [before30days,"$time_stamp"] },
                      then:"$deal_value",
                      else:0
                    }
                  }
                } // end of sum
              }
            }], function(err,value) {
              if(err)
                console.log(err);
              else{
                finalData['totalDealValueAdded'] = value[0].totVal;
                callback(null,finalData, before30days);
              }
            }) // end of aggregate
          }, // end of total deal value function


          function(finalData,before30days,callback)
          {
            // Number of new deals won

            lead.aggregate([{
              $group:
              {
                _id: {"organisation":orgID._id},
                count: {$sum:
                  { $cond:{if:
                    { $and:
                      [{ $lte: [before30days,"$time_stamp"] },
                      { $eq: [ "$status", 'Won' ] }]
                    },
                    then:1,
                    else:0
                  }
                }
              } // end of sum
            }// end of group
          }
          ],function(err,value) {
            if(err)
              console.log(err);
            else{
              finalData['numberNewDealsWon'] = value[0].count;
              callback(null,finalData,before30days);
                }
              }) // end of aggregate
          }, // end of function to calculate number of new deals won

          function(finalData,before30days,callback)
          {
            lead.aggregate([
              {
                $group :{
                  _id: {organisation : orgID._id},
                  totVal : {$sum:
                    { $cond:{if:
                      { $and:
                        [{ $lte: [before30days,"$time_stamp"] },
                        { $eq: [ "$status", 'Won' ] }]
                      },
                      then:"$deal_value",
                      else:0
                    }
                  }
                } // end of sum
              } // end of group
            }
            ], function(err,value){
              if(err)
              console.log(err);
              else {
                finalData['totalDealValueWon'] = value[0].totVal;
                callback(null,finalData, before30days);
              }
            }) // end of aggregate
          }, // end of function to calculate deal value won

          function(finalData,before30days,callback)
          {
            // Number of new deals lost

            lead.aggregate([{
              $group:
              {
                _id: orgID._id,
                count: {$sum:
                  { $cond:{if:
                    { $and:
                      [{ $lte: [before30days,"$time_stamp"] },
                      { $eq: [ "$status", 'Lost' ] }]
                    },
                    then:1,
                    else:0
                  }
                }
              } // end of sum
            } // end of group
          }],function(err,value) {
            if(err)
              console.log(err);
            else{
              finalData['numberNewDealsLost'] = value[0].count;
              callback(null,finalData,before30days);
                }
              }) // end of aggregate
          }, // end of function to calculate number of new deals lost

          function(finalData,before30days,callback)
          {
            lead.aggregate([
              {
                $group :{
                  _id: {organisation : orgID._id},
                  totVal : {$sum:
                    { $cond:{if:
                      { $and:
                        [{ $lte: [before30days,"$time_stamp"] },
                        { $eq: [ "$status", 'Lost' ] }]
                      },
                      then:"$deal_value",
                      else:0
                    }
                  }
                } // end of sum
              } // end of group
            }], function(err,value){
              if(err)
              console.log(err);
              else {
                finalData['totalDealValueLost'] = value[0].totVal;
                callback(null,finalData);
              }
            }) // end of aggregate
          }], // end of function to calculate deal value lost

          function (err, finalData)
          {
            if (err)
              return callback1(err);
          var newSummaryModel = new SummaryInterval({
              user: user,
              organisation: orgID,
              numberNewDeals: finalData['numberNewDeals'],
              totalDealValue: finalData['totalDealValueAdded'],
              numberNewDealsWon:finalData['numberNewDealsWon'],
              totalDealValueWon:finalData['totalDealValueWon'],
              numberNewDealsLost:finalData['numberNewDealsLost'],
              totalDealValueLost:finalData['totalDealValueLost']
            });

            newSummaryModel.save(function(err,savedSummaryModel)
            {
              if(err)
                return callback1(err);
              // console.log("something",savedSummaryModel);
              // console.log(finalData);
            })
          }
      ); // end of async.waterfall
}; // end of wrapper function



  var ObjectId = require('mongoose').Types.ObjectId;
  // computeSummaryInterval({"_id": ObjectId('58afc55fe1badc37ee0817f2')});
  // numberNewDealsFunc({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
  // totDealVal({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
  // numNewDealsWon({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
  // totDealWonVal({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
  // numNewDealsLost({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
  // totDealValueLost({"_id": ObjectId('58afc15fe1badc37ee0817ce')});
