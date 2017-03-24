# PhysicsExprSimulationTest-NGLib

USTCORi Physics Experiment Simulation System Node.js Lib


## Example

```JavaScript
const PESTlib = require('./PESTest-client');
const PESTAgent = PESTlib.PESTAgent;
const xml = PESTlib.PESTxml;

var request = new xml("USTCORi.ExamSystem.BLL.BLLSystemUser", "InterfaceLogin");
request.pushParameter('userID','12345678');
request.pushParameter('password','12345678');
var agent = new PESTAgent();
(async function () {
   const res = await agent.doFetch(request.toString());
   console.log(res);
})();
```
