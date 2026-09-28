import {Composition, Folder} from "remotion";
import {DeskUtilsQuickFilm} from "./DeskUtilsQuickFilm";
import {AnnotateScene} from "./scenes/AnnotateScene";
import {CaptureOcrScene} from "./scenes/CaptureOcrScene";
import {ClipboardScene} from "./scenes/ClipboardScene";
import {EndCardScene} from "./scenes/EndCardScene";
import {HeroScene} from "./scenes/HeroScene";
import {PrivacyScene} from "./scenes/PrivacyScene";
import {QuickRingScene} from "./scenes/QuickRingScene";

export const DeskUtilsCompositions: React.FC = () => {
  return (
    <>
      <Folder name="DeskUtilsQuickFilm-Scenes">
        <Composition
          id="DeskUtilsHero"
          component={HeroScene}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsClipboard"
          component={ClipboardScene}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsCaptureOcr"
          component={CaptureOcrScene}
          durationInFrames={240}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsQuickRing"
          component={QuickRingScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsAnnotate"
          component={AnnotateScene}
          durationInFrames={225}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsPrivacy"
          component={PrivacyScene}
          durationInFrames={105}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="DeskUtilsEndCard"
          component={EndCardScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Composition
        id="DeskUtilsQuickFilm"
        component={DeskUtilsQuickFilm}
        durationInFrames={1260}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
