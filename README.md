# Vuetify2 Component Types

This package includes generated global component types for Vuetify ~2.6.13 and Vue 2.7. This will give full intellisense to Volar when using these versions.

![npm](https://img.shields.io/npm/v/vuetify2-component-types)

## Instructions
1. Install this package: `npm i vuetify2-component-types -D`
1. Add this package to your tsconfig's `types`:
    ``` json
    {
      "compilerOptions": {
        "types": ["vuetify2-component-types"],
      }
    },
    ```
1. Configure tsconfig's `vueCompilerOptions` for proper Volar support:
    ``` json
    {
      "vueCompilerOptions": {
        "target": 2.7,
        "experimentalModelPropName": {
          "input-value": {
            "v-checkbox": true,
            "v-switch": true,
            "v-chip": true,
            "v-btn": true,
            "v-list-item": true,
            "v-bottom-navigation": true
          },
          "": { "input": true },
          "value": {
            "input": { "type": "text" },
            "textarea": true,
            "select": true
          }
        }
      },
    }
    ```

## Acknowledgements
Most of the credit goes to [@kingyue737](https://github.com/kingyue737) who made the initial script [here](https://github.com/vuetifyjs/vuetify/issues/14798#issuecomment-1139788615).