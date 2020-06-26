const productionSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      site: {
        type: 'string',
        errorMessage: {
          required: 'Missing Header for site',
          type: 'should be a string',
        },
      },
      id: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for id',
          type: 'should be a number',
        },
      },
      "type": {
        type: 'string',
        errorMessage: {
          required: 'Missing header for type',
          type: 'should be a string',
        },
      },
      rank: {
        type: 'number',
        minimum: 1,
        maximum: 5,
        errorMessage: {
          required: 'Missing header for rank',
          type: 'should be a number',
          maximum: 'should be between 1 & 5',
          minimum: 'should be between 1 & 5'
        },
      },
      total_capacity: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for total_capacity',
          type: 'should be a number',
        },
      },
      production: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for production',
          type: 'should be a number',
        },
      },
      liquid_capacity: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for liquid_capacity',
          type: 'should be a number',
        },
      },
      cake_capacity: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for cake_capacity',
          type: 'should be a number',
        },
      },
      total_imports: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for total_imports',
          type: 'should be a number',
        },
      },
    },
    required: [
      'site',
      'type',
      'id',
      'liquid_capacity',
      'total_capacity',
      'rank',
      'production',
      'cake_capacity',
      'total_imports',
    ],
  },
};

export default productionSchema;
