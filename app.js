const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });
const btn = document.getElementById("clip");
const status = document.getElementById("status");

btn.onclick = async () => {
  const file = document.getElementById("video").files[0];
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!file || !start || !end) {
    alert("Upload video & isi waktu dulu");
    return;
  }

  status.innerText = "Loading FFmpeg engine (tunggu ya)...";
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  status.innerText = "Processing video...";
  await ffmpeg.run(
    "-i", "input.mp4",
    "-ss", start,
    "-to", end,
    "-c", "copy",
    "output.mp4"
  );

  const data = ffmpeg.FS("readFile", "output.mp4");
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = "clip.mp4";
  a.click();

  status.innerText = "Selesai ✔ Video ter-download";
};
