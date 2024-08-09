const updateDetails = () => {
  if (window.location.hash) {
    let node = document.getElementById(window.location.hash.substring(1));
    while (node) {
      node = node.closest("details");
      if (!node) break;
      node.open = true;
      node = node.parentElement;
    }
  }
};

window.onload = updateDetails;
window.onhashchange = () => {
  updateDetails();
  if (window.location.hash) {
    document.getElementById(window.location.hash.substring(1)).scrollIntoView();
  }
};

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, name) => searchParams.get(name),
  set: (searchParams, name, value) => searchParams.set(name, value),
});
document.getElementById("zig-version").value = params["zig_version"];

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

async function update() {
  const versionInput = document.getElementById("zig-version");

  const url = new URL("https://releases.zigtools.org/v1/zls/select-version");
  url.searchParams.set("zig_version", versionInput.value);
  url.searchParams.set("compatibility", params["compatibility"] ?? "full");
  const response = await fetch(url);
  const json = await response.json();

  if ("message" in json) {
    versionInput.setCustomValidity(json.message);
    document.getElementById("build-from-source-result").style.display = "none";
    document.getElementById("prebuilt-binary-result").style.display = "none";
    return;
  } else {
    versionInput.setCustomValidity("");
  }

  if (!("version" in json) || !("date" in json)) {
    alert("418 I'm a teapot");
    document.getElementById("build-from-source-result").style.display = "none";
    document.getElementById("prebuilt-binary-result").style.display = "none";
    return;
  }

  const heading = document.createElement("tr");
  for (const item of ["OS", "Arch", "Filename", "Signature", "Size"]) {
    const th = document.createElement("th");
    th.innerHTML = item;
    heading.appendChild(th);
  }

  const thead = document.createElement("thead");
  thead.appendChild(heading);

  const tbody = document.createElement("tbody");

  for (const [key, value] of Object.entries(json)) {
    if (key === "version") continue;
    if (key === "date") continue;

    const target = key.split("-");

    const arch = document.createElement("td");
    arch.innerHTML = target[0];

    const os = document.createElement("td");
    os.innerHTML = target[1].charAt(0).toUpperCase() + target[1].slice(1);

    const index = value.tarball.lastIndexOf("/") + 1;
    const tarballLink = document.createElement("a");
    tarballLink.setAttribute("href", value.tarball);
    tarballLink.innerHTML = value.tarball.substring(index);

    const link = document.createElement("td");
    link.innerHTML = tarballLink.outerHTML;

    const signatureLink = document.createElement("a");
    signatureLink.setAttribute("target", "_blank");
    signatureLink.setAttribute("href", value.tarball + ".minisig");
    signatureLink.innerHTML = "minisig";

    const signature = document.createElement("td");
    signature.innerHTML = signatureLink.outerHTML;

    const size = document.createElement("td");
    size.setAttribute("title", "Base 1024");
    size.innerHTML = formatBytes(parseInt(value.size));

    const tr = document.createElement("tr");
    tr.appendChild(os);
    tr.appendChild(arch);
    tr.appendChild(link);
    tr.appendChild(signature);
    tr.appendChild(size);

    tbody.appendChild(tr);
  }

  const table = document.createElement("table");
  table.appendChild(thead);
  table.appendChild(tbody);

  document.getElementById("prebuilt-binary-table").innerHTML = table.outerHTML;

  document.getElementById("build-from-source-result").style.display = "none";
  document.getElementById("prebuilt-binary-result").style.display = "none";
  switch (params["compatibility"]) {
    default:
    case "full": {
      document.getElementById("build-from-source-result").style.display = "";
      
      // `indexOf` returns `-1` when not found, how convenient...
      const tag = json.version.substring(json.version.indexOf("+") + 1);

      document.getElementById(
        "build-from-source-code"
      ).innerHTML = `git clone https://github.com/zigtools/zls
cd zls
git checkout ${tag}
zig build -Doptimize=ReleaseSafe`;
    }
    case "only-runtime": {
      document.getElementById("prebuilt-binary-result").style.display = "";
      break;
    }
  }
}

if (params["zig_version"]) {
  update();
}
