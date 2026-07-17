# Live Photo ARD

## Status

Accepted.

## Context

SoraPaper already supported `:::img` blocks for captions, scaling, links and image credits. The existing `live` attribute only emitted marker data and a visual badge, so readers still saw a static image even when authors provided a Live Photo video source.

Apple LivePhotosKit JS supports playing Live Photos on the web from a still photo and a paired MOV video. Its player requires a DOM element with stable width and height, then accepts photo and video sources through declarative data attributes or the JavaScript API.

Validation with real exported assets showed that playback depends on internal Live Photo metadata, not just file extensions. The still JPEG contained `Apple:MediaGroupUUID`; the paired MOV contained `Keys:ContentIdentifier`; both values matched. The MOV also contained an Apple QuickTime metadata track (`NRT Metadata`, `MetaFormat: mebx`) and `StillImageTime`.

## Decision

Live Photo support is implemented as progressive enhancement on top of `:::img`:

- `src` remains the still image and fallback.
- `live` is the paired MOV video source.
- `ratio` controls the stable player aspect ratio and defaults to `16/9`.
- `photoTime`, `liveControls` and `livePreload` are passed through to LivePhotosKit when present.
- Article pages mount `LivePhotoLoader.astro`, which only loads Apple LivePhotosKit JS when live photo targets exist.
- Runtime initialization prefers `augmentElementAsPlayer` / `augementElementAsPlayer` and falls back to older APIs only for compatibility.

The Markdown transform stays in `src/lib/markdown/remark-callouts.mjs`; runtime loading stays isolated in `src/components/LivePhotoLoader.astro`; visual treatment stays in `src/styles/global.css`.

## Consequences

Static rendering and no-JavaScript reading remain intact because the still image is always present. Ordinary Markdown images and non-live `:::img` blocks do not load the external LivePhotosKit script.

Authors need to provide an actual still-photo and MOV video pair for reliable playback. Large video files can hurt article performance, so proactive loading is opt-in through `livePreload`.

Synthetic test assets can be small enough for the repository, but they must be treated as fixtures rather than proof of full Live Photo compatibility. A generated JPEG/MOV pair can be made closer to a real pair by matching `Apple:MediaGroupUUID` on the JPEG with `Keys:ContentIdentifier` on the MOV. However, without the MOV `mebx` metadata track and `StillImageTime`, it may still fail in LivePhotosKit. The `photoTime` attribute can pass a still-frame time to the player, but a real exported Live Photo pair remains the acceptance baseline.

Useful inspection commands:

```bash
exiftool -a -G1 -s -MediaGroupUUID -ContentIdentifier -StillImageTime photo.jpg live.mov
exiftool -ee -a -G1 -s live.mov
ffprobe -hide_banner -show_format -show_streams -of json live.mov
```

## Validation

Required validation for future changes:

- `pnpm run check`
- `pnpm exec astro build`
- Visual review on a page containing a real Live Photo pair in light and dark mode, desktop and mobile.
