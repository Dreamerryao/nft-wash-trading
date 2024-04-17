const { assert } = require("console");
const fs = require("fs");

// read nft_data/*.json
const directory = "nft_data";
const nftData = fs.readdirSync(directory).map((file) => {
  const txs = JSON.parse(fs.readFileSync(`${directory}/${file}`));

  // build graph
  const graph = {};
  txs.map((tx) => {
    if (!graph[tx.sender.address]) {
      graph[tx.sender.address] = [];
    }
    if (!graph[tx.receiver.address]) {
      graph[tx.receiver.address] = [];
    }
    graph[tx.sender.address].push({
      to: tx.receiver.address,
      timestamp: tx.time,
      event: tx.event,
      amount: tx.price ? tx.price.value : 0,
    });
  });

  // describe graph
  const m = txs.length;
  const n = Object.keys(graph).length;
  const nodes = Object.keys(graph);

  assert(n === nodes.length, "n should be equal to the number of nodes");

  const pre = Array(n + 1).fill(-1);
  const color = Array(n + 1).fill(0);

  const cycles = [];

  const buildCycle = (start, end) => {
    let cycle = [start];
    for (let cur = end; cur !== start; cur = pre[cur]) {
      cycle.push(cur);
    }
    cycle.push(start);
    // cycles.push(cycle.reverse());
    // need address
    // filter this cycle:
    // a -> transfer -> b -> transfer -> c -> transfer -> a
    let isAllTransfer = true;
    cycle.reverse();

    let cycleStr = `${start}`;
    cycle.map((node, i) => {
      if (i > 0) {
        const from = nodes[cycle[i - 1]];
        const to = nodes[node];

        const edge = graph[from].find((edge) => edge.to === to);
        cycleStr += `->${edge.event}->${node}`;
        if (edge.event !== "transfer") {
          isAllTransfer = false;
        }
      }
    });

    if (!isAllTransfer) {
      console.log(`[${file.split('.')[0]}] Cycle detected:${cycleStr}`);
      cycles.push(cycle);
    }
    // else {
    //   console.log(`Cycle is all transfer: ${cycle}, file: ${file}`);
    // }
  };

  const dfs = (source) => {
    color[source] = 1;
    graph[nodes[source]].map((edge, i) => {
      const target = nodes.indexOf(edge.to);
      if (color[target] === 0) {
        pre[target] = source;
        dfs(target);
      } else if (color[target] === 1) {
        buildCycle(target, source);
      }
    });
    color[source] = 2;
  };

  nodes.map((_, i) => {
    if (color[i] === 0) {
      dfs(i);
    }
  });
});
