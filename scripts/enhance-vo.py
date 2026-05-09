#!/usr/bin/env python3
"""Enhance the recorded VO: high-pass filter (remove rumble), soft compression
(reduce dynamic-range gaps), and peak-normalize. Pure Python — no deps."""
import wave, struct, math, subprocess, os, sys

SRC = 'public/pitch/voiceover-ar.m4a'
ORIG_BACKUP = 'public/pitch/voiceover-ar.original.m4a'
TMP_IN  = '/tmp/diwan-vo-in.wav'
TMP_OUT = '/tmp/diwan-vo-out.wav'
DEST = 'public/pitch/voiceover-ar.m4a'

# Backup original first
if not os.path.exists(ORIG_BACKUP):
    subprocess.run(['cp', SRC, ORIG_BACKUP], check=True)

print('1/6  m4a → wav (44.1kHz mono, upsampled)...')
subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@44100', SRC, TMP_IN],
               check=True, stdout=subprocess.DEVNULL)

print('2/6  reading samples...')
w = wave.open(TMP_IN, 'rb')
sr = w.getframerate()
n_ch = w.getnchannels()
n_frames = w.getnframes()
raw = w.readframes(n_frames)
w.close()
samples = list(struct.unpack('<%dh' % (n_frames * n_ch), raw))
if n_ch == 2:
    samples = [(samples[i] + samples[i+1]) // 2 for i in range(0, len(samples), 2)]
print(f'      {len(samples)} samples at {sr} Hz, {len(samples)/sr:.2f}s')

# 3. High-pass filter at 90 Hz — kills room rumble, AC hum, mic handling noise
print('3/6  high-pass filter @ 90 Hz...')
fc = 90.0
RC = 1.0 / (2 * math.pi * fc)
dt = 1.0 / sr
alpha = RC / (RC + dt)
prev_x = 0.0
prev_y = 0.0
hpf = [0.0] * len(samples)
for i, x in enumerate(samples):
    y = alpha * (prev_y + x - prev_x)
    hpf[i] = y
    prev_x = x
    prev_y = y

# 4. Soft expansion / noise gate: pull down very quiet windows (room tone)
#    while leaving voice untouched. Smooth attack/release to avoid pumping.
print('4/6  soft noise gate (-42 dB, 50ms window, 200ms release)...')
win = sr // 20      # 50 ms
release_win = sr // 5  # 200 ms
gate_thresh = 32768 * (10 ** (-42 / 20))
floor_gain = 0.18    # -15 dB residual on truly quiet sections

# Per-window RMS
rms_per_win = []
for i in range(0, len(hpf), win):
    chunk = hpf[i:i+win]
    s = sum(v*v for v in chunk) / len(chunk)
    rms_per_win.append(math.sqrt(s))

# Window targets: 1.0 if speaking, floor_gain if below threshold
targets = [1.0 if r > gate_thresh else floor_gain for r in rms_per_win]

# Smooth targets with single-pole release filter
smoothed = list(targets)
for i in range(1, len(smoothed)):
    if smoothed[i] < smoothed[i-1]:
        # Decay slowly (release)
        a = win / (win + release_win)
        smoothed[i] = smoothed[i-1] * (1 - a) + smoothed[i] * a
    else:
        # Attack instantly (no boost delay)
        smoothed[i] = max(smoothed[i], smoothed[i-1])

# Apply per-sample
gated = list(hpf)
for wi, gain in enumerate(smoothed):
    base = wi * win
    for j in range(win):
        idx = base + j
        if idx >= len(gated):
            break
        gated[idx] *= gain

# 5. Soft compression — knee at -18 dBFS, ratio 2:1
print('5/6  soft compression (knee -18 dBFS, ratio 2:1)...')
knee_lin = 32768 * (10 ** (-18 / 20))
compressed = [0.0] * len(gated)
for i, x in enumerate(gated):
    a = abs(x)
    if a <= knee_lin:
        compressed[i] = x
    else:
        # Above knee, compress 2:1
        excess = a - knee_lin
        sign = 1 if x > 0 else -1
        compressed[i] = sign * (knee_lin + excess * 0.5)

# 6. Peak normalize to -1 dBFS
print('6/6  peak normalize to -1 dBFS + write...')
peak = max(abs(v) for v in compressed) or 1
target_peak = 32768 * (10 ** (-1 / 20))  # -1 dBFS
g = target_peak / peak
out_int = [int(max(-32768, min(32767, v * g))) for v in compressed]

# Write wav
w = wave.open(TMP_OUT, 'wb')
w.setnchannels(1)
w.setsampwidth(2)
w.setframerate(sr)
w.writeframes(struct.pack('<%dh' % len(out_int), *out_int))
w.close()

# Re-encode to m4a at 96 kbps (higher than original 62 kbps)
print('     wav → m4a at 128 kbps...')
subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '128000',
                TMP_OUT, DEST], check=True, stdout=subprocess.DEVNULL)

# Cleanup
os.remove(TMP_IN)
os.remove(TMP_OUT)

# Report
sz = os.path.getsize(DEST)
info = subprocess.check_output(['afinfo', DEST]).decode()
dur = next((l for l in info.split('\n') if 'duration' in l.lower()), '?')
print(f'\n✓ {DEST} — {sz/1024:.0f} KB · {dur.strip()}')
print(f'  Backup of original at {ORIG_BACKUP}')
