# /stickman

A Claude skill that turns a topic into a finished stickman film: an MP4 rendered entirely from code, with film-style camera work and real sound effects.

- **Video:** 2D or 3D, any length, with planted-foot walking and a frame-by-frame audit.
- **Voiceover:** writes scripts to paste into ElevenLabs, and builds the film to your MP3.
- **Sound:** your choice of effects, background music and voiceover.
- **YouTube:** title ideas and thumbnail prompts for ChatGPT, Google Flow or similar.

It needs no paid tools and no AI image or video tools. ElevenLabs is optional. It runs on Windows, macOS and Linux, and it is built for the Claude free plan too.

## Install

### Claude app or claude.ai, including the free plan
1. Download [`stickman.zip`](https://github.com/michxlai/stickman-skill/raw/main/stickman.zip). Leave it zipped.
2. Check that code execution is on: **Settings > Capabilities**, "Create and edit files".
3. Go to [**Customize > Skills**](https://claude.ai/customize/skills).
4. Click **+**, choose **Create skill**, then **Upload a skill**, and pick the zip.
5. Switch the skill on, and type `/stickman` in a new chat.

### Claude Code: paste the link
Paste this into Claude Code:

```text
Install the skill from https://github.com/michxlai/stickman-skill by following its README
```

### Claude Code: commands
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

### Claude Code: plugin
This route is easy to update, but the command becomes `/stickman:stickman`:

```text
/plugin marketplace add michxlai/stickman-skill
/plugin install stickman@stickman-skill
```

### For Claude
If you were asked to install this skill, copy the `skills/stickman` folder from this repository to `~/.claude/skills/stickman` (on Windows, `%USERPROFILE%\.claude\skills\stickman`), then tell the person to start a new session and use `/stickman`. If you are in a chat without that folder, tell them to use the zip steps above.

## Use

```text
/stickman a 30 second story about a lighthouse keeper who finds a message in a bottle
```

Claude asks about anything the request leaves open: 2D or 3D, length, voiceover, sound effects, background music and storyboard. You can also ask for only a voiceover script, or only titles and thumbnail prompts.

**With a voiceover:** attach your MP3 and the script text. The film is cut to your voice. No SRT is needed.

**Music:** attach a track to use it. If you say yes to music without one, Claude generates a soft music bed in code.

## What runs where
On first use the skill checks for Python, ffmpeg, Chromium (through Playwright), numpy, scipy and Pillow, and installs what is missing. The Claude chat sandbox normally has these already. In Claude Code you need Python 3 on your machine. The 3D route also needs Node.

Render time is about 4 minutes for 30 s of 2D on 2 cores. 3D is about 8 times slower. If a run stops, the same command resumes it.

## Good to know
- Claude can't hear audio, so the mix is measured, not listened to. Give it a listen and ask for changes.
- 3D is the less proven route. 2D is the default for a reason.
- Long films on the free plan may hit usage limits. Start short.

## Licence and credits
Code and docs are under the [MIT licence](LICENSE). Sound effects in `skills/stickman/sfx/` are by [Kenney](https://www.kenney.nl) under [CC0](http://creativecommons.org/publicdomain/zero/1.0/).

`stickman.zip` is the `skills/stickman` folder, zipped. `tools/make_zip.py` rebuilds it.
