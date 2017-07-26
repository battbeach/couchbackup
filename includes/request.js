// Copyright © 2017 IBM Corp. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

const pkg = require('../package.json');
const http = require('http');
const https = require('https');
const cloudant = require('cloudant');

const userAgent = 'couchbackup-cloudant/' + pkg.version + ' (Node.js ' +
      process.version + ')';

module.exports = {
  client: function(url, parallelism) {
    var protocol = (url.match(/^https/)) ? https : http;
    const keepAliveAgent = new protocol.Agent({
      keepAlive: true,
      keepAliveMsecs: 30000,
      maxSockets: parallelism
    });
    // Split the URL for use with nodejs-cloudant
    var actUrl = url.substr(0, url.lastIndexOf('/'));
    var dbName = url.substr(url.lastIndexOf('/') + 1);
    return cloudant({url: actUrl,
      requestDefaults: {
        agent: keepAliveAgent,
        headers: {'User-Agent': userAgent},
        gzip: true}}).use(dbName);
  }
};
