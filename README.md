# /stickman

A Claude skill that turns a topic into a finished stickman film: an MP4 rendered entirely from code, with film-style camera work and real sound effects.

## Install in 3 clicks (Claude app or claude.ai, free plan too)
1. **[Download stickman.zip](https://github.com/michxlai/stickman-skill/raw/main/stickman.zip)** and leave it zipped.
2. Open [**Customize > Skills**](https://claude.ai/customize/skills), click **+**, choose **Create skill**, then **Upload a skill** and pick the zip.
3. Switch the skill on, then type `/stickman` in a new chat.

If it won't run, check that code execution is on under **Settings > Capabilities** ("Create and edit files").

## What it does
- **Story ideas:** a numbered list of ideas to pick from, fitted to your length.
- **Storyboard:** a scene-by-scene table with preview images to approve before the render.
- **Video:** 2D or 3D in the same look, any length, with planted-foot walking and a frame-by-frame audit.
- **Voiceover:** writes scripts to paste into ElevenLabs, and builds the film to your MP3.
- **Sound:** your choice of effects, background music and voiceover.
- **YouTube:** title ideas and thumbnail prompts for ChatGPT, Google Flow or similar.

It needs no paid tools and no AI image or video tools. ElevenLabs is optional. It runs on Windows, macOS and Linux, and it is built for the Claude free plan too.

## Install in Claude Code

### Paste the link
Paste this into Claude Code:

```text
Install the skill from https://github.com/michxlai/stickman-skill by following its README
```

### Commands
macOS or Linux:

```bash
git clone https://github.com/michxlai/stickman-skill.git
mkdir -p ~/.claude/skills
cp -R stickman-skill/skills/stickman ~/.claude/skills/
```

Windows PowerShell:

```powershell
git clone https://github.com/michxlai/stickman-skill.git
New-Item -ItemType Directory -Force "$HOME\.claude\skills"
Copy-Item -Recurse -Force stickman-skill\skills\stickman "$HOME\.claude\skills\"
```

Then start a new session and type `/stickman`.

### Plugin
This route is easy to update, but the command becomes `/stickman:stickman`:

```text
/plugin marketplace add michxlai/stickman-skill
/plugin install stickman@stickman-skill
```

### For Claude
If you were asked to install this skill, copy the `skills/stickman` folder from this repository, or the `stickman` folder inside `stickman.zip`, to `~/.claude/skills/stickman` (on Windows, `%USERPROFILE%\.claude\skills\stickman`). Then tell the person to start a new session and use `/stickman`. In a chat that can't write there, tell them to use the zip steps above, so the whole folder is installed and not just SKILL.md.

## Use

```text
/stickman a 30 second story about a lighthouse keeper who finds a message in a bottle
```

Claude asks about anything the request leaves open: 2D or 3D, length, voiceover, sound effects, background music and whether you want a storyboard first. You can also ask for only story ideas, a voiceover script, or titles and thumbnail prompts.

**With a voiceover:** attach your MP3 and the script text. The film is cut to your voice. No SRT is needed.

**Music:** attach a track to use it. If you say yes to music without one, Claude generates a soft music bed in code.

## What runs where
On first use the skill checks for Python, ffmpeg, Chromium (through Playwright), numpy, scipy and Pillow, and installs what is missing. The Claude chat sandbox normally has these already. In Claude Code you need Python 3 on your machine. The 3D route also needs Node.

Render time is about 4 minutes for 30 s of 2D on 2 cores. 3D takes longer. If a run stops, the same command resumes it.

## Good to know
- Claude can't hear audio, so the mix is measured, not listened to. Give it a listen and ask for changes.
- 3D uses the same colours and flat look as 2D, and adds real camera moves.
- Long films on the free plan may hit usage limits. Start short.

## Licence and credits
Code and docs are under the [MIT licence](LICENSE). Sound effects in `skills/stickman/sfx/` are by [Kenney](https://www.kenney.nl) under [CC0](http://creativecommons.org/publicdomain/zero/1.0/).

`stickman.zip` is the `skills/stickman` folder, zipped. `tools/make_zip.py` rebuilds it.
