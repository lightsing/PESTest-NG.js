"use strict";

const convert = require("xml-js");

class PESTPaper {
  constructor(xml) {
    this.xml = xml;
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
