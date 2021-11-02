# Asciiflow (Modded)

The intent of this project is to add specific functionality to [asciiflow](https://asciiflow.com) that may be useful for red team operations.
Instead of forking the official asciiflow [github](https://github.com/lewish/asciiflow), that repo has been heavily refactored and simplified to enable quick development without worrying about things like editor extensions or desktop versions.

## Getting Started

### Prerequisites

```
nodejs
```

### Installation

```
git clone https://github.com/spenceradolph/asciiflow-mod
cd asciiflow-mod
yarn install
```

### Development

The following command runs a webpack dev-server that serves the client and re-compiles when files are changed.
Your browser should auto-open http://localhost:9000/ and display the tool.

```
yarn run develop
```

The package.json contains other applicable scripts for building and testing.

### Templates

Currently, templates can be added into the client/draw/template_ascii.ts file directly.
This will likely change in future updates to allow easier / user-friendly uploading of templates.
Simply copy a template, change the variable name and data, and add it to the bottom export with a key to select it.
