const transportCostSchema = {
  "from":{
    prop: 'from',
    type: String,
    required: true
  },
  "id_from":{
    prop: 'id_from',
    type: Number,
    required: true
  },
  "type_from": {
    prop: 'type_from',
    type: String,
    required: true
  },
  "rank_from":{
    prop: 'rank_from',
    type: Number,
    required: true,
    parse(value) {
      if(value < 1 || value > 5){
        throw new Error('required to be a number between 1 and 5')
      }
      return value;
    }
  },
  "to":{
    prop: 'to',
    type: String,
    required: true
  },
  "id_to":{
    prop: 'id_to',
    type: Number,
    required: true
  },
  "type_to": {
    prop: 'type_to',
    type: String,
    required: true
  },
  "rank_to":{
    prop: 'rank_to',
    type: Number,
    required: true,
    parse(value) {
      if(value < 1 || value > 5){
        throw new Error('required to be a number between 1 and 5')
      }
      return value;
    }
  },
  "cost_per_tds": {
    prop: 'cost_per_tds',
    type: Number,
    required: true
  }
}

export default transportCostSchema;
