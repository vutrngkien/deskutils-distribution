import {FootageScene} from "./FootageScene";

export const HeroScene: React.FC = () => {
  return (
    <FootageScene
      source="footage/hero-menu.mov"
      trimBefore={60}
      caption="Small tools. Right where you need them."
    />
  );
};
