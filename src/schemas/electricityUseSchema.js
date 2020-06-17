const electricityUseSchema = {
  "site":{
    prop: 'site',
    type: String,
    required: true
  },
  "id":{
    prop: 'id',
    type: Number,
    required: true
  },
  "type": {
    prop: 'type',
    type: String,
    required: true
  },
  "rank":{
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
  "area": {
    prop: 'area',
    type: Number,
    required: true
  },
  "cost_per_kwh": {
    prop: 'cost_per_kwh',
    type: Number,
    required: true
  },
  "consumption_kwh_per_tds": {
    prop: 'consumption_kwh_per_tds',
    type: Number,
    required: true
  },
  "indigenous":{
    prop: 'indigenous',
    type: Number,
    required: true
  },
  "unthickened": {
    prop: 'unthickened',
    type: Number,
    required: true
  },
  "thickened": {
    prop: 'thickened',
    type: Number,
    required: true
  },
  "cake": {
    prop: 'cake',
    type: Number,
    required: true
  }
}

export default electricityUseSchema;
