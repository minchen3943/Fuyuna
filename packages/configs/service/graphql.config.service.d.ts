interface ApolloDriverConfig {
  autoSchemaFile: string;
  sortSchema: boolean;
  playground: boolean;
  debug: boolean;
}

declare class GraphqlConfig {
  constructor(env: { [k: string]: string | undefined });
  private getValue(key: string, throwOnMissing?: boolean): string | undefined;
  public ensureValues(keys: string[]): this;
  public isProduction(): boolean;
  public isSortSchema(): boolean;
  public getGraphqlConfig(): ApolloDriverConfig;
}

declare const graphqlConfig: GraphqlConfig;

export { graphqlConfig };
