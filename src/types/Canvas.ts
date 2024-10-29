import { LineCustom } from "./LineCustom";

type canvasWidth = number;
type canvasHeight = number;
type canvas = HTMLCanvasElement;
type ctx = CanvasRenderingContext2D;
type stringState = React.Dispatch<React.SetStateAction<string>>;
type numberState = React.Dispatch<React.SetStateAction<number>>;
type FormState = React.Dispatch<React.SetStateAction<FormData>>;
type booleanState = React.Dispatch<React.SetStateAction<boolean>>;

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
  setFormData: FormState;
  formData: FormData;
  setGoDraw: booleanState;
  goDraw: boolean;
  POST_ID: string;
};
export type FormData = {
  id: string;
  title: string;
  date: string;
  emotion: string;
  type: string;
  draw?: string | null;
  content: string;
};

export type DrawProps = {
  POST_ID: string;
  setFormData: FormState;
  setGoDraw: booleanState;
  goDraw: boolean;
  formData: FormData;
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
