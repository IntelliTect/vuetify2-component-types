// Script by Yue JIN @kingyue737
// https://github.com/vuetifyjs/vuetify/issues/14798#issuecomment-1139788615

import { readFileSync } from "fs";
import prettier from "prettier";

const webTypes = JSON.parse(
  readFileSync("./node_modules/vuetify/dist/json/web-types.json")
);

const blackList = ["VFlex", "VLayout"]; // Components not to define in global

function convertType(typeStr) {
  switch (typeStr) {
    case "array":
      return "any[]";
    case "function":
      return "Function";
    case "date":
      return "Date";
    case "regexp":
      return "RegExp";
    default:
      return typeStr;
  }
}

function getType(attrType) {
  if (typeof attrType === "string") {
    return convertType(attrType);
  } else {
    return attrType.map((str) => convertType(str)).join("|");
  }
}

function getDescription(obj) {
  return obj.description ? `/** ${obj.description} */\n` : "";
}

function getSlotPropType(type) {
  return type
    .replaceAll("eventName", "eventName: string")
    .replaceAll(':"', ":")
    .replaceAll('",', ",")
    .replaceAll('"}', "}")
    .replace(/\/\/.*/, "")
    .replaceAll("):", ")=>")
    .replace(/(aria-[a-z]*):/g, '"$1":')
    .replace(/ = \w*/g, '') // remove default values
    .replaceAll("function", "Function")
    .replaceAll("Function", "(...args: any[]) => any")
    .replaceAll("object", "{ [key: keyof any]: any }")
    .replaceAll("?boolean", "boolean | undefined");
}

function getSlotName(name) {
  if (name === "header.<name>") {
    return "[name:`header.${string}`]";
  } else if (name === "item.<name>") {
    return "[name:`item.${string}`]";
  } else if (name.startsWith("item.data-table") || name.startsWith("header.data-table")) {
    // Ts doesn't allow overriding template literals with more specific keys/values.
    return `//@ts-expect-error\n '${name}'`;
  }
  return `'${name}'`;
}

const types = webTypes.contributions.html.tags
  .filter((vm) => !blackList.includes(vm.name))
  .map(
    (vm) =>
      vm.name +
      ": DefineComponent<{" +
      vm.attributes
        .map(
          (attr) =>
            getDescription(attr) +
            `${attr.name.replace(/-./g, (x) => x[1].toUpperCase())}?: ${getType(
              attr.value.type
            )}`
        )
        .join("\n") +
      "}" +
      (vm.slots?.length
        ? ",{$scopedSlots: Readonly<{\n" +
          vm.slots
            .map(
              (slot) =>
                getDescription(slot) +
                `${getSlotName(slot.name)}:${
                  slot["vue-properties"]
                    ? "(args: {" +
                      slot["vue-properties"]
                        .map(
                          (prop) => prop.name + ":" + getSlotPropType(prop.type)
                        )
                        .join("\n") +
                      "}) => VNode[]"
                    : "undefined"
                }`
            )
            .join("\n") +
          "}>}\n"
        : "") +
      ">"
  )
  .join("\n\n");

console.log();

console.log(
  prettier.format(
    `
import type { DataTableHeader, DataOptions, CalendarTimestamp as VTimestamp } from 'vuetify'
import type VueComponent from "vue"
import type { DefineComponent, VNode } from "vue"
type eventHandler = Function
interface srcObject {
  src: string
  srcset?: string
  lazySrc: string
  aspect: number
}

declare module 'vue' {
  export interface GlobalComponents {
    ${types}
  }
}

export {}`,
    {
      filepath: "index.ts",
      parser: "typescript",
      semi: false,
    }
  )
);
