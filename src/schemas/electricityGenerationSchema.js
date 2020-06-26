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
  "perc_availability": {
    prop: 'perc_availability',
    type: Number,
    required: true
  },
  "installed_capacity_kw": {
    prop: 'installed_capacity_kw',
    type: Number,
    required: true
  },
  "active_hours": {
    prop: 'active_hours',
    type: Number,
    required: true
  },
  "roc_rate": {
    prop: 'roc_rate',
    type: Number,
    required: true
  },
  "roc_value": {
    prop: 'roc_value',
    type: Number,
    required: true
  },
  "electricity_value": {
    prop: 'electricity_value',
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
