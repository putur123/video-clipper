const { createFFmpeg, fetchFile } = window.FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

const clipBtn = document.getElementById("clip");
const statusText = document.getElementById("status");

clipBtn.onclick = async () => {
  const file = document.getElementById("video").files[0];
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!file) {
    alert("Pilih video dulu");
    return;
  }

  statusText.innerText = "Loading FFmpeg engine... (tunggu ±10–30 detik)";

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  statusText.innerText = "Processing video...";

  await ffmpeg.run(
    "-i", "input.mp4",
    "-ss", start,
    "-to", end,
    "-c", "copy",
    "output.mp4"
  );

  const data = ffmpeg.FS("readFile", "output.mp4");

  const videoURL = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );

  const a = document.createElement("a");
  a.href = videoURL;
  a.download = "clip.mp4";
  a.click();

  statusText.innerText = "Selesai ✅ Video ter-download";
};

