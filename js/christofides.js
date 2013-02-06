(function() {

function Graph() {
  this.nodes = {};
  this.edges = {};
}

Graph.prototype = {

  size: function() {
    return Object.keys(this.nodes).length;
  },

  addNode: function(id, data) {
    this.nodes[id] = data;
  },

  addEdge: function(id1, id2, d) {
    var edges = this.edges,
        data = d || {}, conns;

    conns = edges[id1] || {};
    conns[id2] = data;
    edges[id1] = conns;

    conns = edges[id2] || {};
    conns[id1] = data;
    edges[id2] = conns;
  },

  removeNode: function(id) {
    var nodes = this.nodes,
        edges = this.edges, i;

    delete nodes[id];
    delete edges[id];

    for (i in edges) {
      if (id in edges[i]) {
        delete edges[i][id];
      }
    }
  },

  removeEdge: function(id1, id2) {
    var edges = this.edges;
    delete edges[id1][id2];
    delete edges[id2][id1];
  },

  eachNode: function(callback, thisArg) {
    var nodes = this.nodes, id;
    for (id in nodes) {
      callback.call(thisArg, id, nodes[id]);
    }
  },

  eachEdge: function(callback, thisArg) {
    var edges = this.edges,
        from, id1, id2;
    for (id1 in edges) {
      from = edges[id1];
      for (id2 in from) {
        callback.call(thisArg, id1, id2, from[id2]);
      }
    }
  },

  getEdges: function(nodeId) {
    return this.edges[nodeId];
  },

  getNode: function(id) {
    return this.nodes[id];
  },

  get: function(id) {
    return this.getNode(id);
  },

  hasNode: function(id) {
    return (id in this.nodes);
  },

  hasEdge: function(id1, id2) {
    return (id2 in this.edges[id1]);
  }
};

function primSpanningTree(graph) {
  var t = new Graph(),
      root = graph.get(0),
      edges,
      edgeSort = function(a, b) {
        return (a[2].weight || 0) - (b[2].weight || 0);
      },
      edgeCollect = function(id1, id2, data) {
        if ((t.hasNode(id1) && !t.hasNode(id2))
            || (!t.hasNode(id1) && t.hasNode(id2))) {
              edges.push([id1, id2, data]);
            }
      },
      node, edge;

  t.addNode(0, root);

  while (t.size() < graph.size()) {
    edges = [];
    graph.eachEdge(edgeCollect);
    edges.sort(edgeSort);
    edge = edges.shift();
    t.addNode(edge[0], graph.get(edge[0]));
    t.addNode(edge[1], graph.get(edge[1]));
    t.addEdge(edge[0], edge[1], edge[2]);
  }

  return t;
}

function completeGraphFromNodes(nodes, dataCallback) {
  var ans = new Graph(),
      ids = [],
      p, i, l;

  dataCallback = dataCallback || function() { return {}; };

  for (p in nodes) {
    ans.addNode(p, nodes[p]);
    ids.push(p);
  }

  for (p = 0, l = ids.length; p < l; ++p) {
    for (i = p + 1; i < l; ++i) {
      ans.addEdge(ids[p], ids[i], dataCallback(ans.get(p), ans.get(i)));
    }
  }

  return ans;
}

function perfectMatching(graph) {

}

})();
