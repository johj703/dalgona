import { DrawImageProps } from "@/types/Canvas";

const drawImage = ({ getImage, ctx, saveHistory, fileRef }: DrawImageProps) => {
  if (getImage) {
    const file = getImage[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
      if (fileRef) fileRef.value = "";
      saveHistory();
    };
  }
};
export default drawImage;
