import {FootageScene} from "./FootageScene";

export const AnnotateScene: React.FC = () => {
  return (
    <FootageScene
      source="footage/clipboard-to-annotate.mov"
      trimBefore={270}
      caption="Make every screenshot clear."
    />
  );
};
