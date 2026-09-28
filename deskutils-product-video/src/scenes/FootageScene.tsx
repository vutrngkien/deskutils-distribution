import {Video} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type FootageSceneProps = {
  caption: string;
  source: string;
  trimBefore: number;
};

export const FootageScene: React.FC<FootageSceneProps> = ({
  caption,
  source,
  trimBefore,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 38%, #1b1b1e 0%, #0b0b0d 62%, #070708 100%)",
        color: "#f5f5f7",
        display: "flex",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
        justifyContent: "flex-start",
        opacity: interpolate(
          frame,
          [0, 12, durationInFrames - 12, durationInFrames - 1],
          [0, 1, 1, 0],
          {
            easing: [
              Easing.bezier(0.16, 1, 0.3, 1),
              Easing.linear,
              Easing.bezier(0.7, 0, 0.84, 0),
            ],
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      }}
    >
      <Interactive.Div
        name="Native footage frame"
        style={{
          alignItems: "center",
          display: "flex",
          height: 854,
          justifyContent: "center",
          marginTop: 38,
          overflow: "hidden",
          scale: interpolate(frame, [0, durationInFrames - 1], [0.985, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
          width: 1840,
        }}
      >
        <Video
          name="Native DeskUtils footage"
          src={staticFile(source)}
          trimBefore={trimBefore}
          muted
          objectFit="contain"
          style={{
            height: "100%",
            width: "100%",
          }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Caption"
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: 52,
          fontWeight: 590,
          height: 188,
          justifyContent: "center",
          letterSpacing: -1.6,
          lineHeight: 1.15,
          maxWidth: 1600,
          opacity: interpolate(
            frame,
            [8, 22, durationInFrames - 24, durationInFrames - 10],
            [0, 1, 1, 0],
            {
              easing: [
                Easing.bezier(0.16, 1, 0.3, 1),
                Easing.linear,
                Easing.bezier(0.7, 0, 0.84, 0),
              ],
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          padding: "0 80px",
          textAlign: "center",
          textWrap: "balance",
          translate: interpolate(frame, [8, 22], ["0px 12px", "0px 0px"], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {caption}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
