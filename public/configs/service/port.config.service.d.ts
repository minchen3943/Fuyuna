declare class PortConfig {
  constructor(env: NodeJS.ProcessEnv);
  public getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): this;
  public getNestPortConfig(): number | string;
}

declare const portConfig: PortConfig;

export { portConfig };
