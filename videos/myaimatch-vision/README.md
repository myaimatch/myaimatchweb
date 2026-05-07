# myAImatch Vision Explainer

30-second cinematic HyperFrames explainer for the `/vision` proposal.

## Deliverables

- Source composition: `index.html`
- Visual identity: `DESIGN.md`
- Voiceover script: `script.txt`
- Generated narration: `narration.wav`
- Draft render: `renders/myaimatch-vision-draft.mp4`

## Render

Use Docker rendering when local Chrome or FFmpeg are unavailable:

```bash
HOME=/tmp/myaimatch-home NPM_CONFIG_CACHE=/tmp/myaimatch-npm-cache \
  npx hyperframes render --docker --quality draft --output renders/myaimatch-vision-draft.mp4
```

## Checks

```bash
HOME=/tmp/myaimatch-home NPM_CONFIG_CACHE=/tmp/myaimatch-npm-cache npx hyperframes lint
npm run build
```

The local HyperFrames browser-based `validate` and `inspect` commands may fail if Chrome cannot launch on the host. Docker render successfully compiles the composition, processes audio, captures 900 frames at 30fps, and writes the MP4.
