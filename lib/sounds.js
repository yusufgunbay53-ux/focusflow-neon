let audioCtx;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

export function playChime() {
  const ac = ctx();
  const now = ac.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02 + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7 + i * 0.12);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + 0.8 + i * 0.12);
  });
}

export function createAmbient() {
  const ac = ctx();
  const master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);
  const noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  const rain = ac.createBufferSource();
  rain.buffer = noiseBuffer;
  rain.loop = true;
  const rainFilter = ac.createBiquadFilter();
  rainFilter.type = "lowpass";
  rainFilter.frequency.value = 900;
  const rainGain = ac.createGain();
  rainGain.gain.value = 0.35;
  rain.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(master);
  rain.start();
  const lofi = ac.createOscillator();
  lofi.type = "triangle";
  lofi.frequency.value = 220;
  const lofiFilter = ac.createBiquadFilter();
  lofiFilter.type = "lowpass";
  lofiFilter.frequency.value = 640;
  const lofiGain = ac.createGain();
  lofiGain.gain.value = 0.08;
  lofi.connect(lofiFilter);
  lofiFilter.connect(lofiGain);
  lofiGain.connect(master);
  lofi.start();
  const notes = [220, 247, 262, 294, 330];
  const drift = setInterval(() => {
    lofi.frequency.setTargetAtTime(notes[Math.floor(Math.random() * notes.length)], ac.currentTime, 0.4);
  }, 1800);
  return {
    setVolume(value) {
      master.gain.setTargetAtTime(value, ac.currentTime, 0.08);
    },
    setMode(mode) {
      rainGain.gain.setTargetAtTime(mode === "rain" || mode === "mix" ? 0.4 : 0.01, ac.currentTime, 0.1);
      lofiGain.gain.setTargetAtTime(mode === "lofi" || mode === "mix" ? 0.09 : 0.01, ac.currentTime, 0.1);
    },
    stop() {
      clearInterval(drift);
      master.gain.setTargetAtTime(0, ac.currentTime, 0.05);
      setTimeout(() => {
        rain.stop();
        lofi.stop();
      }, 180);
    },
  };
}
