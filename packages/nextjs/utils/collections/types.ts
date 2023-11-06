export interface NFTCollection {
  description: string;
  webLink: string;
  contract: string;
  twitter: string;
  bannerImage: string;
  name: string;
  symbol: string;
  totalItems: string;
  tokens: NFTToken[];
}

export interface NFTToken {
  description?: string;
  image: string;
  name?: string;
  attributes: NFTAttribute[];
  background?: string;
  skin?: string;
  body?: string;
  face?: string;
  head?: string;
}

interface NFTAttribute {
  trait_type: string;
  value: string;
}
