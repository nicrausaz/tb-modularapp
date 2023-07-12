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
        },
        specificConfig: {
          $ref: '#/definitions/SpecificConfig',
        },
      },
      required: ['author', 'description', 'icon', 'name', 'requires', 'specificConfig', 'version'],
      title: 'Module',
    },
    SpecificConfig: {
      type: 'object',
      additionalProperties: true,
      title: 'SpecificConfig',
      properties: {
        '^[a-zA-Z0-9]+$': {
          $ref: '#/definitions/SpecificConfigEntry',
        },
      },
    },
    SpecificConfigEntry: {
      type: 'object',
      additionalProperties: false,
      properties: {
        type: {
          type: 'string',
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
      },
      required: ['description', 'label', 'type', 'value'],
      title: 'SpecificConfigEntry',
    },
  },
}