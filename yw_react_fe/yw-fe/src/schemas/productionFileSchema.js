const productionSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      site: {
        type: 'string',
        errorMessage: {
          required: 'Missing Header for site',
          type: 'site should be a string',
        },
      },
      st: {
        type: 'string',
        errorMessage: {
          required: 'Missing header for st',
          type: 'st should be a string',
        },
      },
      id: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for id',
          type: 'id should be a number',
        },
      },
      liquid_capacity: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for liquid_capacity',
          type: 'st should be a number',
        },
      },
      rank: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for rank',
          type: 'rank should be a number',
        },
      },
      production: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for production',
          type: 'production should be a number',
        },
      },
      cake_capacity: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for cake_capacity',
          type: 'cake_capacity should be a number',
        },
      },
      total_imports: {
        type: 'number',
        errorMessage: {
          required: 'Missing header for total_imports',
          type: 'total_imports should be a number',
        },
      },
    },
    required: [
      'site',
      'st',
      'id',
      'liquid_capacity',
      'rank',
      'production',
      'cake_capacity',
      'total_imports',
    ],
  },
};

export default productionSchema;
