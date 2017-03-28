"use strict";

class PESTPatch {

  constructor(question) {
    this.question = question;
    if (question.attributes.Type !== 'OP') {
      this.nonOP();
    }else{
      this.isOP();
    }
  }

  nonOP() {
    var stdAnswer = [];
    var totalScore = [];
    this.question.elements.forEach( function(child) {
      switch (child.name) {
        case 'StdAnswer':
          stdAnswer = child.elements;
          break;
        case 'TotalScore':
          totalScore = child.elements;
          break;
        case 'StudentAnswer':
          child.elements = stdAnswer;
          break;
        case 'StudentScore':
          child.elements = totalScore;
          break;

      }
    });
  }

  isOP() {
    var rejection = this;
    this.question.elements.forEach( function(child) {
      switch (child.name) {
        case 'Score':
          child.elements[1].elements = child.elements[0].elements;
          break;
        case 'CheckPoint': // Go to patch each TestTarget
          child.elements.forEach( function(targets) { if (targets.name == 'TestTarget') {
            var realScore = 0;
            if(!targets.elements){ targets.elements.forEach( function(target) {
              switch (target.name) {
                case 'Group':
                  realScore += rejection.patchGroup(target.elements);
                  break;
                case 'RealScore':
                  target.elements = [{ "type":"text", "text": realScore.toString()}];
                  break;
              }
            });}
          }});
          break;
      }
    });
  }

  patchGroup(group) { // Should return a number, thx
    var score = 0;
    group.elements.forEach( function(para) { if (para.name == 'Para') {
      var rightRule = '';
      var totalScore = 0;
      var stdResult = [];
      para.elements.forEach( function(child) { if (child.name == 'StdResult') {
        stdResult = child.elements; // TODO: Cannot extract exp result from xml
      }});
      para.elements.forEach( function(child) {
        switch (child.name) {
          case 'RealResult':
            child.elements = stdResult;
            break;
          case 'StdResultShowInfo':
            rightRule = child.elements;
            break;
          case 'TotalScore':
            totalScore = parseFloat(child.elements[0].text);
            break;
        }
      });
      score += totalScore;
      para.elements.push({ type: 'element', name: 'StudentResultShowInfo',
                           elements: [ { type: 'text', text: rightRule } ] });
    }});
    return score;
  }
}

exports.PESTPatch = PESTPatch
