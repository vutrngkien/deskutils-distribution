'use client';
import {
  ArrowUpRight,
  Circle,
  Copy,
  Crop,
  Highlighter,
  Layers,
  MousePointer2,
  MoveLeft,
  MoveRight,
  PenLine,
  Pin,
  RotateCcw,
  RotateCw,
  Shield,
  Square,
  Trash2,
  Type,
  Upload,
} from 'lucide-react';
import { useScreenshotState } from './ScreenshotTabs';

function DocumentScene({ annotate = false }: { annotate?: boolean }) {
  return (
    <div className="home-shot-document">
      <div className="home-shot-document-nav">
        <span>Docs › Onboarding flow</span>
        <span>Draft 3</span>
      </div>
      <b className="home-shot-doc-heading">Welcome screen review</b>
      <span className={`home-shot-doc-intro ${annotate ? 'home-shot-highlight' : ''}`}>
        Feedback on the first screen new users see.
      </span>
      <div className="home-shot-doc-card" />
      <div className="home-shot-doc-image" />
      <b className="home-shot-doc-card-title">Plan your week in minutes</b>
      <span className="home-shot-doc-card-body">
        Add tasks, set priorities and see what’s next.
      </span>
      <span className="home-shot-doc-button">Get started</span>
      <span className="home-shot-doc-note" style={{ filter: annotate ? 'blur(5px)' : undefined }}>
        Internal note: hold until legal review on Friday
      </span>
      {annotate && (
        <>
          <div className="home-shot-red-box" />
          <div className="home-shot-red-arrow">
            <MoveLeft size={32} />
          </div>
          <span className="home-shot-red-note">Make this larger</span>
          {[
            [300, 59],
            [226, 122],
            [228, 240],
          ].map(([left, top], i) => (
            <span key={i} className="home-shot-number" style={{ left, top }}>
              {i + 1}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
function TrafficLights() {
  return (
    <div className="home-shot-traffic">
      {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
        <span key={color} style={{ background: color }} />
      ))}
    </div>
  );
}
const tools = [
  MousePointer2,
  Square,
  Square,
  Circle,
  ArrowUpRight,
  MoveRight,
  Type,
  Highlighter,
  Shield,
  Crop,
  Layers,
  Circle,
  PenLine,
];
export function ScreenshotStage() {
  const state = useScreenshotState();
  return (
    <div aria-hidden="true" className="home-shot-native" data-screenshot-state={state}>
      {state === 'capture' ? (
        <>
          <div className="home-shot-window">
            <div className="home-shot-window-bar">
              <TrafficLights />
              <span>Onboarding flow — Draft 3</span>
            </div>
            <DocumentScene />
          </div>
          <div className="home-shot-capture-selection" />
          {[
            [195, 239],
            [795, 239],
            [195, 451],
            [795, 451],
          ].map(([left, top], i) => (
            <span key={i} className="home-shot-handle" style={{ left, top }} />
          ))}
          <span className="home-shot-size">1200 × 424</span>
        </>
      ) : (
        <div className="home-shot-editor">
          <div className="home-shot-toolbar">
            <TrafficLights />
            {[Crop, Layers, RotateCcw, RotateCw].map((Icon, i) => (
              <Icon key={i} size={20} />
            ))}
            <div className="home-shot-tools">
              {tools.map((Icon, i) => (
                <span key={i} className={i === 4 ? 'home-shot-tool-selected' : ''}>
                  <Icon size={20} />
                </span>
              ))}
            </div>
            <span className={`home-shot-save ${state === 'save' ? 'home-shot-save-active' : ''}`}>
              Save
            </span>
          </div>
          <div className="home-shot-stylebar">
            <MousePointer2 size={17} />
            <b>Style</b>
            <span className="home-shot-styletools">
              {[MousePointer2, Square, ArrowUpRight, Type, Circle, PenLine].map((Icon, i) => (
                <span key={i}>
                  <Icon size={16} />
                </span>
              ))}
            </span>
            <b className="flex items-center gap-1">
              Redact <Shield size={17} />
            </b>
          </div>
          <div className="home-shot-editor-workspace">
            <DocumentScene annotate />
          </div>
          <div className="home-shot-bottom">
            <span>100%</span>
            <MousePointer2 size={20} />
            <div>
              {[Layers, Upload, Pin, Copy, Trash2].map((Icon, i) => (
                <span
                  key={i}
                  className={
                    state === 'save' && (i === 2 || i === 3) ? 'home-shot-export-active' : ''
                  }
                >
                  <Icon size={21} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
