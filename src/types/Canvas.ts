import { LineCustom } from "./LineCustom";

type canvasWidth = number;
type canvasHeight = number;
type canvas = HTMLCanvasElement;
type ctx = CanvasRenderingContext2D;
type input = HTMLInputElement;
type stringState = React.Dispatch<React.SetStateAction<string>>;
type numberState = React.Dispatch<React.SetStateAction<number>>;

export type CanvasProps = {
  canvasWidth: canvasWidth;
  canvasHeight: canvasHeight;
  lineCustom: LineCustom;
  isEraser: boolean;
  getImage: input;
  pathMode: string;
  setPathMode: stringState;
};

export type DrawImageProps = {
  getImage: input;
  ctx: ctx;
  saveHistory: () => void;
};

export type Context = {
  canvas: canvas;
  canvasContext: ctx;
  canvasWidth: canvasWidth;
  canvasHeight: canvasHeight;
};

export type ReDrawProps = {
  pathHistory: string[];
  canvas: canvas;
  canvasContext: ctx;
};

export type ChangedoProps = {
  pathStep: number;
  ctx: ctx;
  canvas: canvas;
  pathPic: HTMLImageElement;
  setPathMode: stringState;
  setPathStep: numberState;
  pathHistory: string[];
};
