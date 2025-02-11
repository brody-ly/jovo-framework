import { PluginConfig, PluginContext } from '@jovotech/cli-core';
import { UnknownObject } from '@jovotech/framework';

import { SupportedLocales } from './constants';

export interface AskSkillList {
  skills: {
    skillId: string;
    stage: string | undefined;
    nameByLocale: {
      [key: string]: string;
    };
    lastUpdated: string;
  }[];
}

export type SupportedLocalesType = typeof SupportedLocales[number];

export interface AlexaCliConfig extends PluginConfig {
  askProfile?: string;
  skillId?: string;
  locales?: {
    [locale: string]: SupportedLocalesType[];
  };
}

export interface AlexaContext extends PluginContext {
  alexa: {
    skillId?: string;
    askProfile?: string;
  };
}

export interface AskProfile {
  skillId: string;
  skillMetadata: { lastDeployHash: string };
  code: UnknownObject;
}

export interface AskConfig {
  askcliStatesVersion: string;
  profiles: Record<string, AskProfile>;
}

export interface AskResources {
  askcliResourcesVersion: string;
  profiles: Record<string, AskProfile>;
}
