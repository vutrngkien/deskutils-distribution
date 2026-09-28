import {FootageScene} from "./FootageScene";

export const ClipboardScene: React.FC = () => {
  return (
    <FootageScene
      source="footage/clipboard.mov"
      trimBefore={12}
      caption="Everything you copied, ready to reuse."
    />
  );
};
