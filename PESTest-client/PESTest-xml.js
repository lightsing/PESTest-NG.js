"use strict";

const convert = require("xml-js");

class PESTxml {
  constructor(bizCode, methodName) {
    this.content =
    { "elements":[
        { "type":"element",
          "name":"s:Envelope",
          "attributes":{ "xmlns:s":"http://schemas.xmlsoap.org/soap/envelope/" },
          "elements":[
            { "type":"element",
              "name":"s:Body",
              "elements":[
                { "type":"element",
                  "name":"DoService",
                  "attributes":{ "xmlns":"http://www.ustcori.com/2009/10" },
                  "elements":[
                    { "type":"element",
                      "name":"request",
                      "attributes":{ "xmlns:i":"http://www.w3.org/2001/XMLSchema-instance" },
                      "elements":[
                        { "type":"element",
                          "name":"BizCode",
                          "elements":[ { "type":"text",
                              "text":bizCode
                            } ]
                        },
                        { "type":"element",
                          "name":"EnableCache",
                          "elements":[ { "type":"text",
                              "text":"false"
                            } ]
                        },
                        { "type":"element",
                          "name":"MethodName",
                          "elements":[ { "type":"text",
                              "text":methodName
                            } ]
                        },
                        { "type":"element",
                          "name":"Parameters",
                          "attributes":{
                            "xmlns:a":"http://schemas.microsoft.com/2003/10/Serialization/Arrays"
                          },
                          "elements":[]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
    this.request = this.content.elements[0].elements[0].elements[0].elements[0].elements;

    this.BizCode = this.request[0].elements[0].text;
    this.EnableCache = this.request[1].elements[0].text;
    this.MethodName = this.request[2].elements[0].text;
    this.Parameters = this.request[3].elements;
  }

  getContent(){
    return this.content;
  }

  setBizCode(bizCode) {
    this.BizCode = bizCode;
  }

  setEnableCache(enableCache) {
    this.EnableCache = enableCache;
  }

  setMethodName(methodName) {
    this.MethodName = methodName;
  }

  pushParameter(keyName, value) {
    var parameter =
    { "type":"element",
      "name":"a:KeyValueOfstringanyType",
      "elements":[ { "type":"element",
          "name":"a:Key",
          "elements":[
            { "type":"text",
              "text":keyName.toString()
            }
          ]
        },
        { "type":"element",
          "name":"a:Value",
          "attributes":{
            "xmlns:b":"http://www.w3.org/2001/XMLSchema",
            "i:type":"b:string"
          },
          "elements":[
            { "type":"text",
              "text":value.toString()
            }
          ]
        }
      ]
    };
    this.Parameters.push(parameter);
  }

  //get request content string
  toString() {
    return convert.js2xml(this.content);
  }

  static escape(xmlString) {
    //TODO: Check
    return '"' + xmlString.replace(/\n/g, '\\r\\n')
                          .replace(/"/g, '\\"') + '"';
  }

  static unescape(xmlString) {
    return xmlString.replace(/\\r\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/^\"+|\"+$/g, '');
  }
}

exports.PESTxml = PESTxml
