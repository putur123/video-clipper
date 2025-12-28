// CEK DULU BIAR JELAS
if (typeof FFmpeg === "undefined") {
  alert("FFmpeg gagal load. Cek koneksi / CDN.");
  throw new Error("FFmpeg not loaded");
}

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

const btn = document.getElementById("clip");
const status = document.getElementById("status");

btn.onclick = async () => {
  const file = document.getElementById("video").files[0];
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!file) {
    alert("Pilih video dulu");
    return;
  }

  status.innerText = "Loading engine (pertama kali agak lama)...";
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  ffmpeg.FS("writeFile", "input.mp4", await fetchFile(file));

  status.innerText = "Processing...";
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

  status.innerText = "Selesai ✅";
};
