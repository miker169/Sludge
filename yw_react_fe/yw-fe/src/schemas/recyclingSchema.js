const recyclingSchena = {
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
  "recycling_route": {
    prop: 'recycling_route',
    type: Number,
    required: true
  },
  "perc_ds_recycled": {
    prop: 'perc_ds_recycled',
    type: Number,
    required: true
  },
  "perc_solids_destroyed": {
    prop: 'perc_solids_destroyed',
    type: Number,
    required: true
  },
  "max_wet_tonnes": {
    prop: 'max_wet_tonnes',
    type: Number,
    required: true
  },
  "cost_per_wet_tonne": {
    prop: 'cost_per_wet_tonne',
    type: Number,
    required: true
  },
  "perc_route_open": {
    prop: 'perc_route_open',
    type: Number,
    required: true
  }
}

export default recyclingSchena;
