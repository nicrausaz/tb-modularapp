export const schema = {
  $ref: '#/definitions/module',
  definitions: {
    module: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: {
          type: 'string',
          minLength: 2,
        },
        description: {
          type: 'string',
          minLength: 2,
        },
        version: {
          type: 'string',
          minLength: 1,
        },
        author: {
          type: 'string',
          minLength: 2,
        },
        icon: {
          type: 'string',
        },
        requires: {
          type: 'array',
          items: {
            type: 'string',
          },
          enum: ['http', 'keyboard'],
        },
        specificConfig: {
          $ref: '#/definitions/SpecificConfig',
        },
      },
      required: ['author', 'description', 'icon', 'name', 'requires', 'specificConfig', 'version'],
      title: 'Module',
    },
    SpecificConfig: {
      title: 'SpecificConfig',
      type: 'object',
      additionalProperties: true,
      properties: {
        '^[a-zA-Z0-9_-]+$': {
          $ref: '#/definitions/SpecificConfigEntry',
        },
      },
    },
    SpecificConfigEntry: {
      title: 'SpecificConfigEntry',
      type: 'object',
      additionalProperties: false,
      properties: {
        type: {
          type: 'string',
          enum: ['text', 'number', 'bool', 'option'],
        },
        label: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        options: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        value: {
          oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
        },
      },
      required: ['description', 'label', 'type', 'value'],
    },
  },
}
