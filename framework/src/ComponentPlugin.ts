import { DeepPartial } from '@jovotech/common';
import { App } from './App';
import {
  BaseComponent,
  ComponentConfig,
  ComponentConstructor,
  ComponentDeclaration,
} from './BaseComponent';
import { ComponentOptionsOf } from './metadata/ComponentMetadata';
import { Plugin, PluginConfig } from './Plugin';

export interface ComponentPluginConfig<COMPONENT extends BaseComponent = BaseComponent>
  extends PluginConfig {
  component?: ComponentConfig<COMPONENT>;
}

export abstract class ComponentPlugin<
  COMPONENT extends BaseComponent = BaseComponent,
  CONFIG extends ComponentPluginConfig<COMPONENT> = ComponentPluginConfig<COMPONENT>,
> extends Plugin<CONFIG> {
  abstract readonly component: ComponentConstructor<COMPONENT>;

  install(app: App): void {
    let options: ComponentOptionsOf<COMPONENT> | undefined = undefined;

    if (this.config.component) {
      options = {
        config: this.config.component as DeepPartial<ComponentConfig<COMPONENT>> | undefined,
      };
    }

    app.use(new ComponentDeclaration(this.component, options));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mount(): void | Promise<void> {}
}
