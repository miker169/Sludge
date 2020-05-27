const liquorsSchema = {
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
  "liquor": {
    prop: 'liquor',
    type: Number,
    required: true
  },
  "applied": {
    prop: 'applied',
    type: Number,
    required: true
  },
  "cost": {
    prop: 'cost',
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

export default liquorsSchema;
