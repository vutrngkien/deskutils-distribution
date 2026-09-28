import {FootageScene} from "./FootageScene";

export const QuickRingScene: React.FC = () => {
  return (
    <FootageScene
      source="footage/quickaccess.mov"
      trimBefore={75}
      caption="Your daily tools, one gesture away."
    />
  );
};
