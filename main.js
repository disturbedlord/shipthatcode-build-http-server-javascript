"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lines = require("fs").readFileSync(0, "utf8").split("\n");
class Simulation {
  workers = null;
  queue = new Array();
  requests = new Map();
  time = 0;
  done = 0;
  setWorkers = (n) => {
    //console.log(n);
    this.workers = new Array();
    for (let i = 0; i < n; i++) this.workers.push(-1);
    // console.log(this.workers.length, n);
  };
  addRequest = (id, cost) => {
    this.requests.set(id, cost);
    this.queue.push(id);
  };
  tick = () => {
    this.time++;
    this.workers.forEach((w) => {
      if (w != -1) {
        let remWork = this.requests.get(w);
        if (remWork) {
          remWork -= 1;
          this.requests.set(w, remWork);
        }
      }
    });
  };
  jobStarted = (job) => {
    console.log(`STARTED ${job}`);
  };
  jobFinished = (job) => {
    console.log(`DONE ${job}`);
    this.done++;
  };
  getFreeWorkers = () => this.workers.filter((e) => e === -1).length;
  showStatus = () => {
    if (this.workers) {
      const free = this.getFreeWorkers() ?? 0;
      const busy = this.workers.length - free;
      const queued = this.queue.length;
      const done = this.done;
      console.log(`free=${free} busy=${busy} queued=${queued} done=${done}`);
    }
  };
  simulate = () => {
    //console.log(this.requests, this.workers, this.time, this.queue);
    const getNextJob = () => this.queue.shift();
    let rerun = false;
    this.workers.forEach((worker, idx) => {
      if (worker === -1) // means its empty
      {
        const nextJob = getNextJob();
        if (nextJob) {
          this.workers[idx] = nextJob; // Job assigned to a worker
          this.jobStarted(nextJob);
        }
      } else {
        const remWork = this.requests.get(worker);
        //console.log(remWork);
        if (remWork != undefined && remWork <= 0) {
          // a job has been completed
          this.jobFinished(worker);
          this.workers[idx] = -1; // set as empty
          rerun = true;
        }
      }
    });
    if (rerun) this.simulate();
  };
}
const simulation = new Simulation();
for (let line of lines) {
  if (line === "") continue;
  const inp = line.split(" ");
  const command = inp[0];
  switch (command) {
    case "WORKERS": {
      simulation.setWorkers(inp[1]);
      break;
    }
    case "ARRIVE": {
      const id = inp[1];
      const cost = inp[2];
      simulation.addRequest(id, cost);
      simulation.simulate();
      break;
    }
    case "TICK": {
      simulation.tick();
      simulation.simulate();
      break;
    }
    case "STATUS": {
      simulation.showStatus();
    }
  }
}
//# sourceMappingURL=main.js.map
