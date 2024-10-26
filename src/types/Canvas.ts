import { LineCustom } from "./LineCustom";

type canvasWidth = number;
type canvasHeight = number;
type canvas = HTMLCanvasElement;
type ctx = CanvasRenderingContext2D;
type stringState = React.Dispatch<React.SetStateAction<string>>;
type numberState = React.Dispatch<React.SetStateAction<number>>;

export type CanvasProps = {
  canvasWidth: canvasWidth;
  canvasHeight: canvasHeight;
  lineCustom: LineCustom;
  isEraser: boolean;
  getImage: FileList | null;
  pathMode: string;
  setPathMode: stringState;
  tool: string;
  fileRef: HTMLInputElement | null;
};

export type DrawImageProps = {
  getImage: FileList | null;
  ctx: ctx;
  saveHistory: () => void;
  fileRef: HTMLInputElement | null;
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
  pathStep: number;
};

export type ChangedoProps = {
  pathStep: number;
  ctx: ctx;
  canvas: canvas;
  pathPic: HTMLImageElement;
  setPathMode: stringState;
  setPathStep: numberState;
  pathHistory: string[];
  saveHistory: () => void;
};
