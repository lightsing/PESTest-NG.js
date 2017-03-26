# PhysicsExprSimulationTest-NGLib

USTCORi Physics Experiment Simulation System Node.js Lib


## Example

### Raw Call

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
   const text = await res.text();
   console.log(text);
})();
```

### Use API Lib

```JavaScript
const PESTClient = require('./PESTest-client').PESTApi;

var client = new PESTClient();

(async function () {
   const res = await client.login('12345678','12345678');
   const text = await res.text();
   console.log(text);
})();
```
