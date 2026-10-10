"""Original upbeat background track for the reel (marimba + bass + light drums).

Synthesized from scratch, so it is royalty-free. Usage: python3 music.py out.wav
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 14.5

N = int(SR * DUR)
mix = np.zeros(N)


def note_freq(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def add(sig, t, gain):
    i = int(t * SR)
    if i >= N:
        return
    seg = sig[: N - i]
    mix[i : i + len(seg)] += seg * gain


def marimba(midi, length=0.6):
    t = np.arange(int(SR * length)) / SR
    f = note_freq(midi)
    env = np.exp(-t * 7)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)
    attack = np.minimum(1, t / 0.003)
    return s * env * attack


def bass(midi, length):
    t = np.arange(int(SR * length)) / SR
    f = note_freq(midi)
    env = np.exp(-t * 2.5) * np.minimum(1, t / 0.01)
    env[-200:] *= np.linspace(1, 0, 200)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)) * env


def kick():
    t = np.arange(int(SR * 0.3)) / SR
    f = 120 * np.exp(-t * 25) + 45
    phase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(phase) * np.exp(-t * 9)


rng = np.random.default_rng(7)


def clap():
    t = np.arange(int(SR * 0.18)) / SR
    noise = rng.standard_normal(len(t))
    env = np.exp(-t * 28) + 0.6 * np.exp(-((t - 0.012) ** 2) / 0.00002)
    # crude band-pass: difference of moving averages
    hp = noise - np.convolve(noise, np.ones(8) / 8, mode="same")
    return hp * env


def shaker():
    t = np.arange(int(SR * 0.06)) / SR
    noise = rng.standard_normal(len(t))
    hp = noise - np.convolve(noise, np.ones(4) / 4, mode="same")
    return hp * np.exp(-t * 70)


# C - G - Am - F, one bar each (4 beats), repeated
chords = [
    (48, [60, 64, 67, 72]),
    (43, [59, 62, 67, 71]),
    (45, [60, 64, 69, 72]),
    (41, [60, 65, 69, 72]),
]
pattern = [0, 2, 1, 3, 2, 1, 3, 2]  # arpeggio order over eighth notes

bars = int(DUR / (4 * BEAT)) + 1
for bar in range(bars):
    root, tones = chords[bar % 4]
    t0 = bar * 4 * BEAT
    add(bass(root, 4 * BEAT * 0.95), t0, 0.55)
    add(bass(root, BEAT * 0.9), t0 + 2.5 * BEAT, 0.35)
    for k, idx in enumerate(pattern):
        add(marimba(tones[idx]), t0 + k * BEAT / 2, 0.28 if k % 2 == 0 else 0.2)
    # little melody hook on top every bar
    add(marimba(tones[3] + 12, 0.8), t0 + 3.5 * BEAT, 0.16)
    for b in range(4):
        add(kick(), t0 + b * BEAT, 0.8)
        if b in (1, 3):
            add(clap(), t0 + b * BEAT, 0.22)
    for e in range(8):
        add(shaker(), t0 + e * BEAT / 2 + BEAT / 4, 0.07)

# end-card "ding" accent at 10.4s
for m in (72, 76, 79, 84):
    add(marimba(m, 1.4), 10.4, 0.18)

# fade in / out
fade_in = int(0.05 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)
fade_out = int(1.2 * SR)
mix[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5

mix = np.tanh(mix * 1.1)  # gentle saturation / glue
mix /= np.max(np.abs(mix)) / 0.89

stereo = np.stack([mix, mix], axis=1)
pcm = (stereo * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
