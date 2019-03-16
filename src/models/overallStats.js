var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OverallStatsSchema = mongoose.Schema({
    organisation : {type: Schema.Types.ObjectId, ref: 'Organisation', index: {unique : true, dropDups: true}},
  updated_by:{type :Schema.Types.ObjectId, ref: 'User', index: true},
  totalDeals: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'
    }},

  totalDealValue: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'
    }},
  averageClosureTime: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'
    }
  },
},{timestamps : true});

//overallStatsSchema.index({endTime: 1, startTime: 1});

var OverallStatsModel = mongoose.model('OverallStats', OverallStatsSchema);
//var newdoc = new overallStatsModel();
//console.log(newdoc);
exports.OverallStats = OverallStatsModel;
