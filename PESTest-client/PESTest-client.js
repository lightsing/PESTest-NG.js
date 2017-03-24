"use strict";

const PESTAgent = require('./PESTest-agent').PESTAgent;
const PESTxml = require('./PESTest-xml').PESTxml;

const USER_BIZCODE = "USTCORi.ExamSystem.BLL.BLLSystemUser";
const ARRAGE_BIZCODE = "USTCORi.ExamSystem.BLL.BLLExamArrage";
const CRITIQUE_BIZCODE = "USTCORi.ExamSystem.BLL.BLLExamCritique";

class PESTClient {
  constructor() {
    this.agent = new PESTAgent();
  }

  async login(user, password) {
    var req = new PESTxml(USER_BIZCODE, "InterfaceLogin");
    req.pushParameter('userID', user);
    req.pushParameter('password', password);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async logout(user) {
    var req = new PESTxml(USER_BIZCODE, "LoginOut");
    req.pushParameter("keyString", user);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async isUserOnline(user, loginuse) {
    var req = new PESTxml(USER_BIZCODE, "IsOnline");
    req.pushParameter('UserID', user);
    req.pushParameter('isLoginUse', loginuse);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findStudentNoticeByPage(user) {
    var req = new PESTxml(USER_BIZCODE, "findStudentNoticeByPage");
    req.pushParameter('StudentID', user);
    req.pushParameter("PageIndex", 1);
    req.pushParameter("PageSize", 100);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findPaperContentByPaperID(paperID) {
    var req = new PESTxml(ARRAGE_BIZCODE, "FindPaperContentByPaperID");
    req.pushParameter("paperID", paperID);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findUndoExamByStudentID(studentID) {
    var req = new PESTxml(ARRAGE_BIZCODE, "FindUndoExamByStudentID");
    req.pushParameter("studentID", studentID);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async updateStudentPaperContent(update) {
    var req = new PESTxml(ARRAGE_BIZCODE, "UpdateStudentPaperContent");
    req.pushParameter("studentInfo", update);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findStudentInfoByExamIDAndStudentID(examID, user) {
    var req = new PESTxml(ARRAGE_BIZCODE, "FindStudentInfoByExamIDAndStudentID");
    req.pushParameter("examID", examID);
    req.pushParameter("studentID", user);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findExamScoreByStudentID(studentID) {
    var req = new PESTxml(CRITIQUE_BIZCODE, "FindExamScoreByStudentIDNew");
    req.pushParameter("studentID", studentID);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findPaperContent(examID, studentID) {
    var req = new PESTxml(CRITIQUE_BIZCODE, "FindPaperContent");
    req.pushParameter("studentID", studentID);
    req.pushParameter("examID", examID);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findSubmitStudentByExamID(examID) {
    var req = new PESTxml(CRITIQUE_BIZCODE, "FindSubmitStudentByExamID");
    req.pushParameter("examID", examID);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

}
