const interleave = require('../');
const pull = require('pull-stream');
const test = require('tape');

function ascending(a, b) {
  return a - b;
}

function descending(a, b) {
  return b - a;
}

test('interleave ascending', function (t) {
  t.plan(2);

  pull(
    interleave(
      [
        pull.values([10, 24, 26, 100]),
        pull.values([1, 25, 50, 51, 52, 53, 54, 55]),
      ],
      ascending,
    ),
    pull.collect((err, arr) => {
      t.error(err, 'no error');
      t.deepEquals(arr, [1, 10, 24, 25, 26, 50, 51, 52, 53, 54, 55, 100]);
      t.end();
    }),
  );
});

test('interleave descending', function (t) {
  t.plan(2);

  pull(
    interleave(
      [
        pull.values([100, 26, 24, 10]),
        pull.values([55, 54, 53, 52, 51, 50, 25, 1]),
      ],
      descending,
    ),
    pull.collect((err, arr) => {
      t.error(err, 'no error');
      t.deepEquals(arr, [100, 55, 54, 53, 52, 51, 50, 26, 25, 24, 10, 1]);
      t.end();
    }),
  );
});
