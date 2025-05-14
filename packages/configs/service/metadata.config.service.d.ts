interface Metadata {
  title: {
    template: string;
    default: string;
  };
  description: string;
  keywords: string[];
}

declare class MetaDataConfig {
  public getMetadataConfig(): Metadata;
}
declare const metadataConfig: MetaDataConfig;
export { metadataConfig };
