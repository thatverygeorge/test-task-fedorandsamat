export type Page = {
  key: string;
  name: string;
  level: number;
  link: string;
  isOpen?: boolean;
  parentKey?: string;
  childPageKeys?: string[];
};

export type Navigation = {
  pages: {
    [key: string]: Page;
  };
  rootLevelKeys: string[];
};
