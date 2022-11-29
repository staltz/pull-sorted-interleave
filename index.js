module.exports = function interleave(streams, compare) {
  if (!streams.length)
    return function empty(_abort, cb) {
      cb(true);
    };

  // for each stream, indicates: 0 = buffer empty, 1 = buffered, 2 = ended
  let state = Array(streams.length).fill(0);
  // for each stream, contains the buffered stream item or the endErr
  let buffer = Array(streams.length).fill(null);

  function fillBuffers(cb) {
    if (state.every((s) => s !== 0)) return cb();
    Promise.all(
      streams.map((stream, i) => {
        if (state[i] !== 0) return Promise.resolve();
        else
          return new Promise((resolve) => {
            stream(null, (end, data) => {
              if (end) {
                state[i] = 2;
                buffer[i] = end;
              } else {
                state[i] = 1;
                buffer[i] = data;
              }
              resolve();
            });
          });
      }),
    ).then(cb);
  }

  function getNextMin(cb) {
    fillBuffers(() => {
      if (state.every((s) => s === 2)) {
        buffer = null;
        state = null;
        cb(true);
        return;
      }
      let min = null;
      let j = -1;
      for (let i = 0, n = streams.length; i < n; i++) {
        if (state[i] === 1) {
          if (j < 0 || compare(buffer[i], min) < 0) {
            min = buffer[i];
            j = i;
          }
        }
      }
      buffer[j] = null;
      state[j] = 0;
      cb(null, min);
    });
  }

  return function interleavedSource(end, cb) {
    if (end) return cb(end);
    if (!state) return cb(true);
    getNextMin(cb);
  };
};
