export interface ITopology {
  id: string;
  name: string;
  type: string;
  propertiesMap?: any;
  children?: ITopology[];
}
