import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 50% 46%, #202024 0%, #111113 52%, #080809 100%)",
        color: "#f5f5f7",
        display: "flex",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
        justifyContent: "center",
        opacity: interpolate(
          frame,
          [0, 14, durationInFrames - 14, durationInFrames - 1],
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
        name="Privacy copy"
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          maxWidth: 1420,
          padding: "0 80px",
          textAlign: "center",
          translate: interpolate(frame, [0, 24], ["0px 16px", "0px 0px"], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Interactive.Div
          name="Privacy title"
          style={{
            fontSize: 92,
            fontWeight: 650,
            letterSpacing: -4.2,
            lineHeight: 1.02,
          }}
        >
          Your work stays yours.
        </Interactive.Div>
        <Interactive.Div
          name="Privacy detail"
          style={{
            color: "#b8b8bf",
            fontSize: 44,
            fontWeight: 420,
            letterSpacing: -1.1,
            lineHeight: 1.28,
            marginTop: 34,
            maxWidth: 1320,
          }}
        >
          Clipboard history stays on your Mac, and text recognition runs on device.
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
