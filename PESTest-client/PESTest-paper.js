"use strict";

const convert = require("xml-js");

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

  update() {
    this.xml = convert.js2xml(this.xml);
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
