const electricityGenerationSchema = {

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
  "availability": {
    prop: 'availability',
    type: Number,
    required: true
  },
  "capacity": {
    prop: 'capacity',
    type: Number,
    required: true
  },
  "active_Hours": {
    prop: 'active_Hours',
    type: Number,
    required: true
  },
  "rr": {
    prop: 'rr',
    type: Number,
    required: true
  },
  "rv": {
    prop: 'rv',
    type: Number,
    required: true
  },
  "ev": {
    prop: 'ev',
    type: Number,
    required: true
  },
  "kwh_tds": {
    prop: 'kwh_tds',
    type: Number,
    required: true
  }
}

export default electricityGenerationSchema;
