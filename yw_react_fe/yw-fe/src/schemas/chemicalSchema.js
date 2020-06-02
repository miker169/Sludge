const chemicalSchema = {
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
  "chemical": {
    prop: 'chemical',
    type: String,
    required: true
  },
  "cost_per_kg": {
    prop: 'cost_per_kg',
    type: Number,
    required: true
  },
  "dose_kg_per_tds": {
    prop: 'dose_kg_per_tds',
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
  },


}

export default chemicalSchema;
