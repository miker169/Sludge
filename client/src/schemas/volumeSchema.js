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
  "type": {
    prop: 'type',
      type: String,
      required: true
  },
  "rank": {
    prop: 'rank',
      type: Number,
      required: true,
      parse(value) {
        if(value < 1 || value > 5){
          throw new Error('required to be a number between 1 and 5')
        }
        return value;
      }
  },
  "perc_ds": {
    prop: 'perc_ds',
    type: Number,
    required: true
  },
  "max_vehicle_vol": {
    prop: 'max_vehicle_vol',
    type: Number,
    required: true
  }
}

export default volumeSchema;
