"use strict";

const convert = require("xml-js");
const patch = require('./PESTest-patch').PESTPatch;

class PESTPaper {
  constructor(xml) {
    this.xml = xml;
    this.unescape();
    this.json = convert.xml2js(this.xml);

    this.info = this.json.elements[0].elements[0].elements;
    this.paperName = this.info[1].elements[0].text;
    this.fullScore = this.info[5].elements[0].text;

    this.questions = this.json.elements[0].elements[1].elements;
  }

  getAns() {
    var ans = [];
    this.questions.forEach( function(question) {
      var stdAnswer = '';
      if (question.attributes.Type !== 'OP') {
        question.elements.forEach( function(child) {
          if (child.name == 'StdAnswer') {
            stdAnswer = child.elements[0].text;
          }
        });
      }
      ans.push(stdAnswer);
    });
    this.ans = ans;
    return ans;
  }

  complete() {
    this.questions.forEach( function(question) {
      question = (new patch(question)).question;
    });
    this.update();
  }

  addHeader(info) {
    var header = {"type":"element", "name":"Student",
                  "elements":[{ "type":"element", "name":"StudentID",
                                "elements":[{ "type":"text", "text":info.StudentID }]
                            },{ "type":"element", "name":"StudentName",
                                "elements":[{ "type":"text", "text":info.StudentName }]
                            },{ "type":"element", "name":"ClassID",
                                "elements":[{ "type":"text", "text":info.ClassID }]
                            },{ "type":"element", "name":"ClassName",
                                "elements":[{ "type":"text", "text":info.ClassName }]
                            },{ "type":"element", "name":"Time",
                                "elements":[{ "type":"element", "name":"MaxTime"},
                                            { "type":"element", "name":"RealTime"}]
                            },{ "type":"element", "name":"GainScore",
                                "elements":[{ "type":"text", "text":this.fullScore }]
                            }]
                };
    this.info.push(header);
  }

  addFinishTime() {
    var submitTime = 'Submit at' +
                     (new Date()).toISOString()
                                 .replace('T',' ')
                                 .replace(/\..*/g,'');
    var comment = { type: 'comment', comment: submitTime };
    this.json.elements.unshift(comment);
  }

  update() {
    this.xml = convert.js2xml(this.json);
  }

  escape() {
    //TODO: Check
    this.xml = '"' + this.xml.replace(/\n/g, '\\r\\n')
                             .replace(/"/g, '\\"') + '"';
  }

  unescape() {
    this.xml = this.xml.replace(/\\r\\n/g, '\n')
                       .replace(/\\"/g, '"')
                       .replace(/^\"+|\"+$/g, '');
  }

  toString() {
    return this.xml;
  }
}

exports.PESTPaper = PESTPaper
