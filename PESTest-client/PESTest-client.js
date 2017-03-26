"use strict";

const convert = require("xml-js");
const PESTApi = require('./PESTest-api').PESTApi;

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
      this.err = e;
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
    this.online = (res.IsSeccess === '0');
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
    if (!res.err) {
      if (res.IsSeccess == '0'){
        this.user.apply(res.content);
      }else{
        throw 'Invaild username or password.';
      }
    }else{
      throw 'Error occured in communication.';
    }
  }

  async logout() {
    var res = await this.client.logout(this.user.userID);
    const text = await res.text();
    res = new Response(text);
    if (res.err) {
      throw 'Error occured in communication.';
    }
  }
}

exports.PESTClient = PESTClient
