var kue = require('kue');
// var kue = require('kue-scheduler')
var domain = require('domain');

var db = require('../db');
var newLead = require('./newLead');
var companyTask = require('./company');
var newsFeed = require('./newsFeed');
var userTask = require('./user');
var salesUserStatsTask = require('./salesUserStats');
var organisationStatsTask = require('./organisationStats');
var salesPipelineStatsTask = require('./salesPipelineStats');

var async = require('async');
var express = require('express');

var queue = kue.createQueue();  // pass any config other than default

var logger = require('../log');

queue.watchStuckJobs(10000);  // removes struckjobs proactively . runs for every 10000ms

// var ui = require('kue-ui');
// var app = express();

// ui.setup({
//     apiURL: '/api', // IMPORTANT: specify the api url 
//     baseURL: '/kue', // IMPORTANT: specify the base url 
//     updateInterval: 5000 // Optional: Fetches new data every 5000 ms 
// });
 
// // Mount kue JSON api 
// app.use('/api', kue.app);
// // Mount UI 
// app.use('/kue', ui.app);
// app.listen(3000); 

kue.app.listen(3000); // kue ui app
kue.app.set('title', 'Kue');
var bufferApi = require('../components/DataScrappers/Buffer/externalApi');


var CronJob = require('cron').CronJob;

new CronJob('0 42 4 * * *', function() {
  
  var job = queue.create('bufferDailySync', {}).attempts(5);
  job.save();
  console.log('bufferDailySync sample job ran at the time.');

}, null
, true, 'Asia/Kolkata');

new CronJob('0 0 6 * * *', function() {
  
  var job = queue.create('datafoxNewsDailySync', {}).attempts(5);
  job.save();

}, function () {
/* This function is executed when the job stops, store the scheduling in log */
}
, true, 'Asia/Kolkata');

new CronJob('0 30 3 * * *', function() {

  var job = queue.create('computeSalesUserStats', {}).attempts(5);
  job.save();

}, function () {
/* This function is executed when the job stops, store the scheduling in log */
}
, true, 'Asia/Kolkata');

new CronJob('0 0 4 * * *', function() {

  var job = queue.create('computeOrganisationStats', {}).attempts(5);
  job.save();

}, function () {
/* This function is executed when the job stops, store the scheduling in log */
}
, true, 'Asia/Kolkata');

new CronJob('0 0 4 * * *', function() {

  var job = queue.create('computePipelineStats', {}).attempts(5);
  job.save();

}, function () {
/* This function is executed when the job stops, store the scheduling in log */
}
, true, 'Asia/Kolkata');

process.once( 'SIGTERM', function ( sig ) {
  queue.shutdown( 5000, function(err) {
    logger.info( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

//listen alrady scheduled jobs
queue.on('already scheduled', function(job) {
  logger.info('already scheduled job', job.id, job.data);
});

//listen on success scheduling
queue.on('schedule success', function(job) {
  logger.info('schedule success', job.id, job.data);
});

//listen on scheduler errors
queue.on('schedule error', function(error) {
  logger.info('schedule error', error.stack);
});

queue.on( 'error', function( err ) {
  logger.error( 'Oops... ', err );
});

queue.process('newLeadAdded', function (job, done) {
  logger.info('newLeadAdded task called with id', job.id);
  var asyncTasks = [];
  var newLeadAddedDomain = domain.create();
  if (job.data.companyId) {
    asyncTasks.push(function (callback) {
      companyTask.handleCompanyDetails(job.data, callback);
    });
  }
  asyncTasks.push(function (callback) {
    newLead.handleNewLeadNewsFeed(job.data, callback)
  });
  newLeadAddedDomain.on('error', function (err) {
    logger.error(err.stack);
    done(err);
  });
  newLeadAddedDomain.run( function () {
   async.series(asyncTasks, function (err) {
     logger.info('newLeadAdded task finished with id', job.id);
     done(err);
    })
  })
});

queue.process('newCompanyCreated', function (job, done) {
  newCompany.handleCompanyDetails(job.data, done);
});

queue.process('datafoxNewsDailySync', function (job, done) {
  logger.info('datafoxNewsDailySyncJob task called with id', job.id);
  var newsDailySyncDomain = domain.create();

  newsDailySyncDomain.on('error', function (err) {
    logger.error(err.stack);
    done(err);
  });
  newsDailySyncDomain.run(function () {
    newsFeed.handleDatafoxNewsDailySync(job.data, function (err) {
      logger.info('datafoxNewsDailySync task finished with id',job.id);
      done(err);
    });
  });
});

queue.process('bufferDailySync', function (job, done) {
  logger.info('bufferDailySync task called with id',job.id);
  var profile_id=null; // Currently synching only for super admin
  bufferApi.getSentPosts(profile_id, function (err, data) {
    // console.log('done getting items from buffer');
    logger.info('bufferDailySync task finished with id',job.id);
    done(err);
  });
});

queue.process('computeOrganisationStats', function (job, done) {
  logger.info('computeOrganisationStats task called with id', job.id);
  
  organisationStatsTask.computeOrganisationStats(job.data, function (err) {
    logger.info('computeOrganisationStats task findished with id', job.id);
    done(err);
  })
});

queue.process('computePipelineStats', function (job, done) {
  logger.info('computePipelineStats task called with id', job.id);
  
  salesPipelineStatsTask.computePipelineStats(job.data, function (err) {
    logger.info('computePipelineStats task findished with id', job.id);
    done(err);
  })
});

queue.process('computeSalesUserStats', function (job, done) {
  logger.info('computeSalesUserStats task called with id', job.id);
  salesUserStatsTask.computeSalesUserStats(job.data, function (err) {
    logger.info('computeSalesUserStats task findished with id', job.id);
    done(err);
  })
});

queue.process('userCreated', function (job, done) {
    logger.info('userCreated task called with id',job.id);
    userTask.handleUserInvites(job.data, function (err, data) {
        logger.info('userCreated task finished with id',job.id);
        done(err);
    });
});

queue.process('sampleJob', function (job, done) {
  var sampleJobDomain = domain.create();
  sampleJobDomain.on('error', function (err) {
    done(err);
  });
  sampleJobDomain.run(function () {
    job.log('sample job started');
    done();
  })
});


// var job = queue
//             .createJob('unique_every', {})
//             .attempts(3)
//             .priority('normal')
//             .unique('unique_every');
//
// queue.every('0 */5 * * * *', job);
//
// queue.process('unique_every', function(job, done) {
//     console.log('unique every task called');
//     done();
// });