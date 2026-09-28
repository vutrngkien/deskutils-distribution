import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background: "#f5f5f7",
        color: "#111113",
        display: "flex",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
        justifyContent: "center",
        opacity: interpolate(
          frame,
          [0, 16, durationInFrames - 10, durationInFrames - 1],
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
        name="End card copy"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          maxWidth: 1500,
          padding: "0 80px",
          scale: interpolate(frame, [0, durationInFrames - 1], [0.985, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Product name"
          style={{
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: -6.4,
            lineHeight: 0.96,
          }}
        >
          DeskUtils
        </Interactive.Div>
        <Interactive.Div
          name="End card tagline"
          style={{
            color: "#4a4a50",
            fontSize: 48,
            fontWeight: 450,
            letterSpacing: -1.5,
            lineHeight: 1.15,
            marginTop: 34,
          }}
        >
          Small tools. Right where you need them.
        </Interactive.Div>
        <Interactive.Div
          name="End card call to action"
          style={{
            color: "#0066cc",
            fontSize: 38,
            fontWeight: 560,
            letterSpacing: -0.6,
            lineHeight: 1.2,
            marginTop: 72,
          }}
        >
          Download for free · deskutils.app
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
