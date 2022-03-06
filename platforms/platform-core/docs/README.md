---
title: 'Core Platform'
excerpt: 'The Jovo Core Platform is a standalone platform integration that can be used to deploy a voice and chat experiences to custom devices and hardware, including the web, mobile apps, and Raspberry Pi.'
---

# Core Platform

The Jovo Core Platform is a standalone [platform integration](https://www.jovo.tech/docs/platforms) that can be used to deploy a voice and chat experiences to custom devices and hardware, including the web, mobile apps, and Raspberry Pi.

## Introduction

![Jovo Client and Jovo Core Platform](https://github.com/jovotech/jovo-framework/raw/v3/latest/jovo-platforms/jovo-platform-core/img/jovo-client-platform-communication.png 'How Jovo Core Platform communicates with clients like web apps')

Besides integrations with major platforms like Alexa, Google Assistant, or Facebook Messenger, Jovo also enables you to connect your own clients to build fully custom conversational experiences for both voice and chat.

As each platform comes with its own structure for requests and responses, companies often create their own internal platform integration with Jovo.

To make the process easier, we created the Jovo Core Platform which comes with its own request and response JSON structure and a lot of helpful features off-the-shelf.

The Jovo Core Platform can be connected to any client (the "frontend" that records speech or text input and passes it to the Jovo app). You can either implement your own client or use existing [Jovo Clients](https://www.jovo.tech/marketplace/tag/clients), e.g. for the web.

The client sends a request to the Jovo app that may contain audio, text, or other input. The Jovo Core Platform then deals with this information and returns a response back to the client. [Learn more about the Core Platform request and response structures below](#requests-and-responses).

Depending on the client, it may be necessary to add integrations to the platform to convert the input to structured data:

- [Automatic Speech Recognition (ASR)](https://www.jovo.tech/marketplace/tag/asr) to turn spoken audio into transcribed text
- [Natural Language Understanding (NLU)](https://www.jovo.tech/marketplace/tag/nlu) to turn raw text into structured input

After these integrations are added, building a Jovo app for custom clients is similar to building for platforms like Alexa and Google Assistant.

## Installation

You can install the plugin like this:

```sh
$ npm install @jovotech/platform-core
```

Add it as plugin to your [app configuration](https://www.jovo.tech/docs/app-config), along with an [NLU integration](https://www.jovo.tech/docs/nlu) like [NLP.js](https://www.jovo.tech/marketplace/nlu-nlpjs)

```typescript
import { App } from '@jovotech/framework';
import { CorePlatform } from '@jovotech/platform-core';
import { LangEn } from '@nlpjs/lang-en';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
// ...

const app = new App({
  plugins: [
    new CorePlatform({
      plugins: [
        new NlpjsNlu({
          languageMap: {
            en: LangEn,
          },
        }),
        // ...
      ],
    }),
    // ...
  ],
});
```

## Configuration

The Core Platform has the following default config properties:

```typescript
new CorePlatform({
  platform: 'core',
  plugins: [],
}),
```

- `platform`: The `platform` name that you can find in the [request documentation below](#request) can be overridden with this property.
- `plugins`: You can add plugins to this array. For example, Core Platform requires an [NLU plugin](https://www.jovo.tech/docs/nlu) to turn raw text into structured meaning.

## Requests and Responses

In a Jovo app, each interaction goes through the [RIDR Lifecycle](https://www.jovo.tech/docs/ridr-lifecycle) that starts with a [request](#requests) from the client and ends with a [response](#responses) back to the client.

### Requests

The request usually contains data like an audio file or raw text ([find all sample request JSONs here](https://github.com/jovotech/jovo-framework/tree/v4/latest/platforms/platform-core/sample-requests)):

```json
{
  "version": "4.0",
  "platform": "core",
  "id": "7bd31461-0211-4c92-b642-69a978c2f18c",
  "timestamp": "2020-11-23T12:35:36.368Z",
  "timeZone": "Europe/Berlin",
  "locale": "en",
  "data": {},
  "input": {
    "type": "INTENT",
    "intent": "MyNameIsIntent",
    "entities": {
      "name": {
        "value": "max"
      }
    }
  },
  "context": {
    "device": {
      "capabilities": ["AUDIO", "SCREEN"]
    },
    "session": {
      "id": "1e4076b8-539a-48d5-8b14-1ec3cf651b7b",
      "data": {},
      "isNew": true,
      "updatedAt": "2020-11-23T12:35:21.345Z"
    },
    "user": {
      "id": "67fed000-9f11-4acf-bbbc-1e52e5ea22a9",
      "data": {}
    }
  }
}
```

The `input` property follows the same structure as the [Jovo `$input` property](https://www.jovo.tech/docs/input).

The `device` property follows the same structure as the [Jovo `$device` property](https://www.jovo.tech/docs/device).

### Responses

The response contains all the information that is needed by the client to display content:

```json
{
  "version": "4.0",
  "output": [
    {
      "message": "Hello World!"
    }
  ],
  "context": {
    "user": {
      "id": "...",
      "data": {}
    },
    "session": {
      "id": "1e4076b8-539a-48d5-8b14-1ec3cf651b7b",
      "data": {},
      "end": false
    },
    "request": {
      "id": "7bd31461-0211-4c92-b642-69a978c2f18c"
    }
  }
}
```

The `output` is added in the same structure as [Jovo output templates](https://www.jovo.tech/docs/output-templates).

## Platform-Specific Features

You can access the Core specific object like this:

```typescript
this.$core;
```

You can also use this object to see if the request is coming from Core (or a different platform):

```typescript
if (this.$core) {
  // ...
}
```

## Custom Platforms

You can create a custom platform based on the Jovo Core Platform using the `createCustomPlatform()` method.

In order to make the type system aware of the new class, some module augmentations have to be done. Here is an example how this is done in the [Jovo Web Platform](https://www.jovo.tech/marketplace/platform-web):

```typescript
declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    WebPlatform?: CorePlatformConfig<'web'>;
  }

  interface ExtensiblePlugins {
    WebPlatform?: CorePlatform<'web'>;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $web?: Core;
  }
}

declare module '@jovotech/framework/dist/types/index' {
  interface NormalizedOutputTemplatePlatforms {
    web?: NormalizedCoreOutputTemplate;
  }
}

// Create the custom platform class
const webPlatform = CorePlatform.createCustomPlatform('WebPlatform', 'web');

// Instantiate the class
const webPlatform = new WebPlatform();
```
