import {Sequence} from "remotion";
import {AnnotateScene} from "./scenes/AnnotateScene";
import {CaptureOcrScene} from "./scenes/CaptureOcrScene";
import {ClipboardScene} from "./scenes/ClipboardScene";
import {EndCardScene} from "./scenes/EndCardScene";
import {HeroScene} from "./scenes/HeroScene";
import {PrivacyScene} from "./scenes/PrivacyScene";
import {QuickRingScene} from "./scenes/QuickRingScene";

export const DeskUtilsQuickFilm: React.FC = () => {
  return (
    <>
      <Sequence name="Hero" durationInFrames={150} premountFor={30}>
        <HeroScene />
      </Sequence>
      <Sequence
        name="Clipboard"
        from={150}
        durationInFrames={240}
        premountFor={30}
      >
        <ClipboardScene />
      </Sequence>
      <Sequence
        name="Capture + OCR"
        from={390}
        durationInFrames={240}
        premountFor={30}
      >
        <CaptureOcrScene />
      </Sequence>
      <Sequence
        name="Quick Ring"
        from={630}
        durationInFrames={180}
        premountFor={30}
      >
        <QuickRingScene />
      </Sequence>
      <Sequence
        name="Annotate"
        from={810}
        durationInFrames={225}
        premountFor={30}
      >
        <AnnotateScene />
      </Sequence>
      <Sequence
        name="Privacy"
        from={1035}
        durationInFrames={105}
        premountFor={30}
      >
        <PrivacyScene />
      </Sequence>
      <Sequence
        name="End card"
        from={1140}
        durationInFrames={120}
        premountFor={30}
      >
        <EndCardScene />
      </Sequence>
    </>
  );
};
