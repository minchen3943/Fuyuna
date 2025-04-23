declare class GraphqlConfig {
  constructor(env: { [k: string]: string | undefined });
  private getValue(key: string, throwOnMissing?: boolean): string | undefined;
  public ensureValues(keys: string[]): this;
  public isProduction(): boolean;
  public isSortSchema(): boolean;
  public getGraphqlConfig(): Partial<ApolloDriverConfig>;
}

declare const graphqlConfig: GraphqlConfig;

export { graphqlConfig };
