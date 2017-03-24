"use strict";

const PESTAgent = require('./PESTest-agent').PESTAgent;
const PESTxml = require('./PESTest-xml').PESTxml;

class PESTClient {
  constructor() {
    this.agent = new PESTAgent();
  }

  async interfaceLogin(user, password) {
    var req = new PESTxml("USTCORi.ExamSystem.BLL.BLLSystemUser", "InterfaceLogin");
    req.pushParameter('userID', user);
    req.pushParameter('password', password);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async logoutUser(user) {
    var req = new PESTxml("USTCORi.ExamSystem.BLL.BLLSystemUser", "LoginOut");
    req.pushParameter("keyString", user);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async isUserOnline(user, loginuse) {
    var req = new PESTxml("USTCORi.ExamSystem.BLL.BLLSystemUser", "IsOnline");
    req.pushParameter('UserID', user);
    req.pushParameter('isLoginUse', loginuse);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }

  async findStudentNoticeByPage(user) {
    var req = new PESTxml("USTCORi.ExamSystem.BLL.BLLSystemUser", "findStudentNoticeByPage");
    req.pushParameter('StudentID', user);
    req.pushParameter("PageIndex", 1);
    req.pushParameter("PageSize", 100);
    var res = await this.agent.doFetch(req.toString());
    return res;
  }
}
