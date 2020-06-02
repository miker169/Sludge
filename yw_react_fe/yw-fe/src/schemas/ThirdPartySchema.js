const thirdPartySchema = {
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
  "available": {
    prop: 'available',
    type: Number,
    required: true
  },
  "third_party_cost_per_tds": {
    prop: 'third_party_cost_per_tds',
    type: Number,
    required: true
  }
}

export default thirdPartySchema;
