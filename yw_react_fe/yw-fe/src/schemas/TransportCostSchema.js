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
  "st_from": {
    prop: 'st_from',
    type: String,
    required: true
  },
  "rank_from":{
    prop: 'rank_from',
    type: Number,
    required: true
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
  "st_to": {
    prop: 'st_to',
    type: String,
    required: true
  },
  "rank_to":{
    prop: 'rank_to',
    type: Number,
    required: true
  },
  "cost": {
    prop: 'cost',
    type: Number,
    required: true
  }
}

export default transportCostSchema;
