import { DrawImageProps } from "@/types/Canvas";

const DrawImage = ({ getImage, ctx, saveHistory }: DrawImageProps) => {
  if (getImage.files) {
    const file = getImage.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
      saveHistory();
    };
  }
};
export default DrawImage;
