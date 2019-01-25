var Twitter = require('twit');
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');

var kinesis = new AWS.Kinesis();

var client = new Twitter({
    consumer_key: 'jq14jsBXZmPfUSndZefV5Ibal',
    consumer_secret: 'seoaGoYWSkrati6s1RdV6C9YQF81MIpGTaKWv6jb1Lql4g6DFh',
    access_token: '3035282928-RzA3I7QlIguFW4q1fdQaJNZTtAFJ3dIF47r5Qgg',
    access_token_secret: 'O76onMiHx7IGK9NTihgzsdiFKT0wEwRfBSIe3W9omthN8'
});

var stream = client.stream('statuses/filter', { track: 'clemson', language: 'en' });
 
stream.on('tweet', function (tweet) {
    // console.log(tweet);
    if (tweet.text) {
        var record = JSON.stringify({
            id: tweet.id,
            timestamp: tweet['created_at'],
            tweet: tweet.text.replace(/["'}{|]/g, ''),
            user_name: tweet.user.screen_name,
            profile_image_url: tweet.user.profile_image_url
        }) + '|'; // record delimiter
        // console.log(record);
        kinesis.putRecord({
            Data: record,
            StreamName: 'cuhackit-twitter-stream',
            PartitionKey: 'key'
        }, function (err, data) {
            if (err) {
                console.error(err);
            }
            console.log('sending: ', tweet.text);
        });
    }
});