var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var stagePipeline = new Schema({
	//user to company
	organisation: {type: Schema.Types.ObjectId, ref: 'Organisation', index: true},
	
	stage: {type: mongoose.Schema.Types.ObjectId, ref: 'LeadStage'},
	stageName: {type: String},
	numberOfDeals:{
		type: Number,
		default: 0,
		validate : {
      		validator : Number.isInteger,
      		message   : '{VALUE} is not an integer value'
    	}},
	totalDealsValue:{
		type: Number,
		default: 0,
		validate : {
      		validator : Number.isInteger,
      		message   : '{VALUE} is not an integer value'
    	}},
	dealReachPercent:{
		type: Number,   
	},
	dealNextPercent:{
		type: Number
	},
	dealLostPercent:{
		type: Number
	},
},{timestamps: true});

stagePipeline.index({endtime:1,startTime:1});
var salesPipelineModel = mongoose.model('salesPipelineStats',stagePipeline);
exports.salesPipelineStats = salesPipelineModel;