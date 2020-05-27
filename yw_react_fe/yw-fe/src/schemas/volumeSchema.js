const volumeSchema =  {
  "site": {
    prop: 'site',
      type: String,
      required: true
  },
  "id": {
    prop: 'id',
      type: Number,
      required: true
  },
  "st": {
    prop: 'st',
      type: String,
      required: true
  },
  "rank": {
    prop: 'rank',
      type: Number,
      required: true
  },
  "perc_ds": {
    prop: 'perc_ds',
    type: Number,
    required: true
  },
  "max_vol": {
    prop: 'max_vol',
    type: Number,
    required: true
  }
}

export default volumeSchema;
