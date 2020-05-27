const productionSchema = {
  "type": "array",
  "items": {
    "properties": {
      "site": {"type": "string" },
      "st": {"type": "string"},
      "id": {"type": "number"},
      "liquid_capacity": {"type": "number"},
      "rank": {"type": "number"},
      "production": {"type": "number"},
      "cake_capacity": {"type": "number"},
      "total_imports": {"type": "number"},
    },
    "required": ["site", "st", "id", "liquid_capacity",
      "rank", "production", "cake_capacity", "total_imports"]
  }
}

export default productionSchema
