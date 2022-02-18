export interface Animal {
    id: string;
    title: string;
  }

export interface Animals extends Array<Animal>{}

export interface RGB{
  r: number;
  g: number;
  b: number;
}