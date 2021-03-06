"use strict";

const convert = require("xml-js");
const PESTApi = require('./PESTest-api').PESTApi;
const PESTPaper = require('./PESTest-paper').PESTPaper;

const dateConv = new Set(['StartTime', 'EndTime', 'PublishTime']);

class Response {
  constructor(text, options={parse2JSON:true}) {
    try{
      this.res = convert.xml2js(text, { compact:true });
      this.response = this.res['s:Envelope']['s:Body']['DoServiceResponse']['DoServiceResult'];
      if (options.parse2JSON) {
        this.content = JSON.parse(this.response.DataString._text);
      }else{
        this.content = this.response.DataString._text;
      }
    }catch(e){
      throw 'Error occured when processing the response.\n'+e
        +'\n\nReport this on https://github.com/lightsing/PESTest-NG.js/issues';
    }
  }
}

class User {
  constructor(info){
    this.userID = info.userID;
    this.password = info.password || info.userID;
    this.authority = 0;
    this.online = false;
    this.schoolName = "";
  }

  apply(info) {
    this.authority = info.Authority;
    this.online = (info.IsSeccess === '0');
    this.schoolName = info.SchoolName;
  }
}

class PESTClient {
  constructor(info){
    this.client = new PESTApi();
    this.user = new User(info);
  }

  async login() {
    var res = await this.client.login(this.user.userID, this.user.password);
    const text = await res.text();
    res = new Response(text);
    if (res.content.IsSeccess == '0'){
      this.user.apply(res.content);
      return true;
    }else{
      throw 'Invaild username or password.';
    }
  }

  async logout() {
    var res = await this.client.logout(this.user.userID);
    const text = await res.text();
    res = new Response(text);
    return res;
  }

  async getUnfinishedExamInfo() {
    var res = await this.client.findUndoExamByStudentID(this.user.userID);
    const text = await res.text();
    res = new Response(text);
    var unfinishedArray = res.content;
    unfinishedArray.forEach(function(info) {
      Object.keys(info).forEach(function(key) {
        if (dateConv.has(key)) {
          info[key].replace(/[\d+]+/, function(time) {
            info[key] = new Date(parseInt(time)+800);
          });
        }
      });
    });
    return unfinishedArray;
  }

  async getGrades() {
    var res = await this.client.findExamScoreByStudentID(this.user.userID);
    const text = await res.text();
    res = new Response(text);
    var gradesArray = res.content;
    return gradesArray;
  }

  async getPaper(paperID) {
    var res = await this.client.findPaperContentByPaperID(paperID);
    const text = await res.text();
    res = new Response(text, { parse2JSON: false });
    var paper = new PESTPaper(res.content);
    return paper;
  }

  async getExamInfo(examID, userID) {
    var res = await this.client.findStudentInfoByExamIDAndStudentID(examID, userID);
    const text = await res.text();
    res = new Response(text);
    return res.content;
  }

  async finishExam(info) {
    var paper = await this.getPaper(info.UsePapers);
    paper.complete();
    paper.addHeader(info);
    paper.addFinishTime();
    var examInfo = await this.getExamInfo(info.ExamID, this.user.userID);
    examInfo.PaperContentXml = paper.xml;
    examInfo.GainPoint = paper.fullScore;
    examInfo.GainShowPoint = paper.fullScore;
    examInfo.IsSubmit = 'true';

    var update = JSON.stringify(examInfo);
    var res = await this.client.updateStudentPaperContent(update);
    const text = await res.text();
    return text;
  }
}

exports.PESTClient = PESTClient
