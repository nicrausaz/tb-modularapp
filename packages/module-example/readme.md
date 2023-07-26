<div align="center">
  <a href="https://github.com/nicrausaz/tb-modularapp">
    <img src="../../docs/logo.svg" alt="Logo" width="160" height="160">
  </a>

  <h3 align="center">Example Module</h3>
  <small></small>

  <p align="center">
    For integration developpement in Modular App
  </p>
</div>

## About

This is an example module for the Modular App. It is used to demonstrate how to create a module for the Modular App.

## Getting Started

You can start by cloning this repository and installing the dependencies:

- [Node.js](https://nodejs.org/) (v. >= 18.16.0 recommended)

Now you can edit the files in the `src` folder to create your own module. You will find some documentation in the existing template code.

## Usage

### Configuration

You will first need to update the `config.json` to fit your needs.

All the following properties are required:

```json
{
  "$schema": "https://test.crausaz.click/schema.json",
  "name": "Example Module",
  "description": "Template for easily creating your custom intergrations for the modular app",
  "version": "1.0.0",
  "author": "Nicolas Crausaz",
  "icon": "icon.svg", // Should be in the src folder
  "requires": ["http", "keyboard"] // List of required accessors (currently only http and keyboard are available)
}
```

Then you can specify the specific configuration for your module:

```json
{
  // ...
  "specificConfig": {
    "anExampleText": {
      "type": "string",
      "label": "An example text",
      "description": "This is an example text",
      "default": "Hello World!"
    }
  }
}
```

These values will be editable by the user in the configuration panel of the module. It is usefull to allow the user to configure the module to fit his needs.

The existing types of specific configuration are:

- `text`: a text value, act as a text input
- `number`: a number value, act as a number input
- `bool`: a boolean value, act as a checkbox
- `option`: a list of options, act as a dropdown
- `secret`: a secret value, act as a password input

### Render

Start by defining the props that your module will receive. You can
define them by extending the `ModuleProps` interface in the `src/index.tsx` file (see the existing example).

### Internal methods

In addition of the given instruction in the `src` folder, you can use the following methods.

```typescript
// Read a value from the configuration
this.getEntryValue<string>('anExampleText')

// Send data to be rendered
this.notify({ message: 'Hello World!' })

// Send data trought a "required" accessors
this.sendData('<accessor_key>', { message: 'Hello World!' })
```

## Contact

Nicolas Crausaz - [Website](https://crausaz.click/)
