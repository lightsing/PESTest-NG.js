"use strict";

const xml = require("xml");

class PESTxml {
  constructor(bizCode, methodName) {
    this.content =
    { 's:Envelope':[
        { _attr: { 'xmlns:s': 'http://schemas.xmlsoap.org/soap/envelope/' } },
        { 's:Body':[
          { 'DoService':[
              { _attr: { 'xmlns': 'http://www.ustcori.com/2009/10' } },
              { 'request':[
                { _attr: { 'xmlns:i': 'http://www.w3.org/2001/XMLSchema-instance' } },
                { BizCode: bizCode },
                { EnableCache: 'false' },
                { MethodName: methodName},
                { Parameters: [
                  { _attr: { 'xmlns:a': 'http://schemas.microsoft.com/2003/10/Serialization/Arrays' } }
                ] }
              ] }
            ]
          }
      ] }
    ]}
    this.request = this.content['s:Envelope'][1]['s:Body'][0]['DoService'][1]['request'];

    this.BizCode = this.request[1].BizCode;
    this.EnableCache = this.request[2].EnableCache;
    this.MethodName = this.request[3].MethodName;
    this.Parameters = this.request[4].Parameters;
  }

  getContent(){
    return this.content;
  }

  setBizCode(BizCode) {
    this.BizCode = BizCode;
  }

  setEnableCache(EnableCache) {
    this.EnableCache = EnableCache;
  }

  setMethodName(MethodName) {
    this.MethodName = MethodName;
  }

  pushParameter(keyName, value) {
    var parameter = { 'a:KeyValueOfstringanyType':[
      { 'a:Key': keyName },
      { 'a:Value': [
        { _attr: { 'xmlns:b': 'http://www.w3.org/2001/XMLSchema', 'i:type':'b:string'} },
        value
      ] } ] };
    this.Parameters.push(parameter);
  }

  //get request content string
  toString() {
    return xml(this.content);
  }
}

exports.PESTxml = PESTxml
