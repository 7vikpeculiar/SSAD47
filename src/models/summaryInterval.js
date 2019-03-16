var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var summaryIntervalSchema= new Schema({
  organisation: {type: Schema.Types.ObjectId, ref: 'Organisation', index: true},
  // for a company, not user

  startTime: {type: Date},

  endTime: {type: Date},
  // duration: {type: Number, default: 0}, // no of days
  numberNewDeals: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },
  totalDealValue: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },
  numberNewDealsWon: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },
  totalDealValueWon: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },
  numberNewDealsLost: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },
  totalDealValueLost: {
    type: Number,
    default: 0,
    validate : {
      validator : Number.isInteger,
      message   : '{VALUE} is not an integer value'}
    },

},
{timestamps: true}
);

summaryIntervalSchema.index({endTime: 1, startTime: 1});

var summaryIntervalModel = mongoose.model('SummaryInterval', summaryIntervalSchema);

exports.SummaryInterval = summaryIntervalModel;
