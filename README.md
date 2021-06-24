# pull-sorted-interleave

combine a series of pull-streams into one pull-stream where the items are sorted. Similar to [pull-sorted-merge](https://github.com/pull-stream/pull-sorted-merge) but does not require the input streams to have the same number of emissions. However, we still assume that each input stream is internally already sorted.

```js
const interleave = require('pull-sorted-interleave')
const pull = require('pull-stream')

pull(
  merge([stream1, stream2, stream3], compare),
  pull.drain(x => {
    console.log(x)
  })
)
```

## License

MIT
