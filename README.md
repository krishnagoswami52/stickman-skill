# /stickman — with a free AI voiceover

A Claude skill that turns a topic into a finished stickman film: an MP4 rendered entirely from code, with film-style camera work, real sound effects and **a free built-in voiceover**. Give it a script, or let Claude write one, and the narration is spoken by an open-source voice and mixed into the video. No ElevenLabs, no API key, no cost.

## Install in 3 clicks (Claude app or claude.ai, free plan too)
1. **[Download stickman.zip](https://github.com/krishnagoswami52/stickman-skill/raw/main/stickman.zip)** and leave it zipped.
2. Open [**Customize > Skills**](https://claude.ai/customize/skills), click **+**, choose **Create skill**, then **Upload a skill** and pick the zip.
3. Switch the skill on, then type `/stickman` in a new chat.

If it won't run, check that code execution is on under **Settings > Capabilities** ("Create and edit files").

## What it does
- **Story ideas:** a numbered list of ideas to pick from, fitted to your length.
- **Storyboard:** a scene-by-scene table with preview images to approve before the render.
- **Video:** 2D or 3D in the same look, any length, with planted-foot walking and a frame-by-frame audit.
- **Free voiceover:** turns any script into speech with the open-source Kokoro voice, then cuts the film to it. 54 voices, including US and UK storytellers and Hindi.
- **Your own voice file:** still works. Attach an ElevenLabs (or any) MP3 and the film is cut to it.
- **Sound:** your choice of effects, background music and voiceover.
- **YouTube:** title ideas and thumbnail prompts for ChatGPT, Google Flow or similar.

It needs no paid tools and no AI image or video tools. It runs on Windows, macOS and Linux, and it is built for the Claude free plan too.

## Use

```text
/stickman a 30 second story about a lighthouse keeper who finds a message in a bottle, with voiceover
```

Claude asks about anything the request leaves open: 2D or 3D, length, voiceover, sound effects, background music and whether you want a storyboard first. You can also ask for only story ideas, a voiceover script, a voiceover audio file, or titles and thumbnail prompts.

**Free voiceover:** say yes to voiceover and either paste your script or let Claude write it. It is spoken, timed and mixed into the final MP4. You also get the voice on its own as `vo.mp3`.

**Pick a voice:** ask Claude to "audition voices" and it sends short samples of your first lines in a few voices. Favourites:

| Voice | Sound |
|---|---|
| `am_michael` | warm US male (default) |
| `bm_george` | calm UK male storyteller |
| `bm_fable` | soft UK male, bedtime fables |
| `am_onyx` | deep US male, dark or tense |
| `af_heart` | the strongest US female voice |
| `bf_emma` | clear UK female |

You can also blend two voices into one, for example `am_michael:0.6+bm_george:0.4`, for a narrator nobody else has.

**Hindi and Hinglish:** Hindi voices `hm_omega`, `hm_psi`, `hf_alpha` and `hf_beta` read Devanagari. English words like "AI" or "app" can stay in English letters. Claude converts a Roman-letter Hinglish script for you. The Hindi voices sound less natural than the English ones.

**With your own MP3:** attach the MP3 and the script text. The film is cut to your voice. No SRT is needed.

**Music:** attach a track to use it. If you say yes to music without one, Claude generates a soft music bed in code.

## Install in Claude Code

### Paste the link
Paste this into Claude Code:

```text
Install the skill from https://github.com/krishnagoswami52/stickman-skill by following its README
```

### Commands
macOS or Linux:

```bash
git clone https://github.com/krishnagoswami52/stickman-skill.git
mkdir -p ~/.claude/skills
cp -R stickman-skill/skills/stickman ~/.claude/skills/
```

Windows PowerShell:

```powershell
git clone https://github.com/krishnagoswami52/stickman-skill.git
New-Item -ItemType Directory -Force "$HOME\.claude\skills"
Copy-Item -Recurse -Force stickman-skill\skills\stickman "$HOME\.claude\skills\"
```

Then start a new session and type `/stickman`.

### Plugin
This route is easy to update, but the command becomes `/stickman:stickman`:

```text
/plugin marketplace add krishnagoswami52/stickman-skill
/plugin install stickman@stickman-free-voice
```

### For Claude
If you were asked to install this skill, copy the `skills/stickman` folder from this repository, or the `stickman` folder inside `stickman.zip`, to `~/.claude/skills/stickman` (on Windows, `%USERPROFILE%\.claude\skills\stickman`). Then tell the person to start a new session and use `/stickman`. In a chat that can't write there, tell them to use the zip steps above, so the whole folder is installed and not just SKILL.md.

## What runs where
On first use the skill checks for Python, ffmpeg, Chromium (through Playwright), numpy, scipy and Pillow, and installs what is missing. The Claude chat sandbox normally has these already. In Claude Code you need Python 3 on your machine. The 3D route also needs Node.

The free voice installs one Python package (`kokoro-onnx`, needs Python 3.10-3.13) and downloads the voice model once from GitHub, about 350 MB. After that it works offline. It runs on a normal CPU: about 0.8 s of work per second of speech on 2 cores, faster on most laptops.

Render time is about 4 minutes for 30 s of 2D on 2 cores. 3D takes longer. If a run stops, the same command resumes it.

## Good to know
- Claude can't hear audio, so the voice and mix are measured, not listened to. Give it a listen and ask for changes.
- A name said wrongly is fixed by respelling it in the script as it sounds. Only that line is spoken again.
- 3D uses the same colours and flat look as 2D, and adds real camera moves.
- Long films on the free plan may hit usage limits. Start short.

## Licence and credits
Based on [stickman-skill](https://github.com/michxlai/stickman-skill) by michxlai. The free voiceover (`skills/stickman/scripts/tts.py`, `references/free-voice.md`) was added on top; nothing else in the original skill was changed.

Code and docs are under the [MIT licence](LICENSE). Sound effects in `skills/stickman/sfx/` are by [Kenney](https://www.kenney.nl) under [CC0](http://creativecommons.org/publicdomain/zero/1.0/). The voice is [Kokoro-82M](https://github.com/hexgrad/kokoro) (Apache-2.0), run through [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) (MIT), so voiceovers can be used in monetised videos. pip also installs the espeak-ng phonemizer (GPL-3.0), used unchanged.

`stickman.zip` is the `skills/stickman` folder, zipped. `tools/make_zip.py` rebuilds it.
