import {FootageScene} from "./FootageScene";

export const CaptureOcrScene: React.FC = () => {
  return (
    <FootageScene
      source="footage/capture-ocr.mov"
      trimBefore={20}
      caption="Capture a region. Copy the text inside it. · Pro"
    />
  );
};
