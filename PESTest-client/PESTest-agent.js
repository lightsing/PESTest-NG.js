"use strict";

const http = require('http');
const fetch = require('node-fetch');

class PESTAgent {
  constructor(url='http://172.18.6.16:8002/BizService.svc', host='172.18.6.16:8002'){
    this.httpAgent = new http.Agent({ keepAlive: true });
    this.fetch = fetch;

    this.url = url;

    this.options = { method: 'POST' };
    this.options.headers = {};
    this.options.headers['Content-Type'] = 'text/xml';
    this.options.headers['SOAPAction'] = '"http://www.ustcori.com/2009/10/IBizService/DoService"';
    this.options.headers['Host'] = host;
    this.options.headers['Expect'] = '100-continue';

    this.options.agent = this.httpAgent;
  }

  // Send a SOAP request
  async doFetch(xmlRequest) {
    this.options.body = xmlRequest;
    var resp = await this.fetch(this.url, options);
    return resp;
  }
}

exports.PESTAgent = PESTAgent
