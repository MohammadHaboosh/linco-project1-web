export const DRAWIO_ORIGIN = "https://embed.diagrams.net";

export const DRAWIO_EMBED_URL =
  `${DRAWIO_ORIGIN}/?embed=1&ui=min&spin=1&proto=json`;

const EMPTY_DRAWIO_XML =
  '<mxfile host="LinCo"><diagram id="linco-blank" name="Page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>';

export const createDrawioStorageKey = (scope) =>
  `linco:drawio:${encodeURIComponent(scope)}`;

const isDrawioXml = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;

  const normalized = value
    .trim()
    .replace(/^<\?xml[^>]*>\s*/i, "")
    .replace(/^<!--[\s\S]*?-->\s*/, "");

  return /^<(mxfile|mxGraphModel)\b/i.test(normalized);
};

const normalizeDrawioFileName = (suggestedName) => {
  const rawName =
    typeof suggestedName === "string" && suggestedName.trim()
      ? suggestedName.trim()
      : "diagram";
  const safeName = [...rawName]
    .map((character) => (character.charCodeAt(0) < 32 ? "-" : character))
    .join("")
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/[. ]+$/g, "")
    .slice(0, 120);
  const fileName = safeName || "diagram";

  return /\.(drawio|xml)$/i.test(fileName) ? fileName : `${fileName}.drawio`;
};

const downloadDrawioFile = (xml, fileName) => {
  const fileUrl = URL.createObjectURL(
    new Blob([xml], { type: "application/xml" }),
  );
  const downloadLink = document.createElement("a");

  downloadLink.href = fileUrl;
  downloadLink.download = fileName;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);

  return { saved: true, usedPicker: false };
};

export const readDrawioXml = (storageKey) => {
  if (!storageKey) return EMPTY_DRAWIO_XML;

  try {
    const storedXml = window.localStorage.getItem(storageKey);
    return isDrawioXml(storedXml) ? storedXml : EMPTY_DRAWIO_XML;
  } catch {
    return EMPTY_DRAWIO_XML;
  }
};

export const persistDrawioXml = (storageKey, xml) => {
  if (!storageKey || !isDrawioXml(xml)) return false;

  try {
    window.localStorage.setItem(storageKey, xml);
    return true;
  } catch {
    return false;
  }
};

export const saveDrawioFileToDevice = async (
  xml,
  suggestedName = "diagram.drawio",
) => {
  if (!isDrawioXml(xml)) {
    return { saved: false, reason: "invalid-xml" };
  }

  const fileName = normalizeDrawioFileName(suggestedName);

  if (typeof window.showSaveFilePicker !== "function") {
    return downloadDrawioFile(xml, fileName);
  }

  let fileHandle;
  try {
    fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: "Draw.io diagram",
          accept: { "application/xml": [".drawio", ".xml"] },
        },
      ],
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      return { saved: false, cancelled: true };
    }

    return downloadDrawioFile(xml, fileName);
  }

  try {
    const writable = await fileHandle.createWritable();
    await writable.write(new Blob([xml], { type: "application/xml" }));
    await writable.close();
    return { saved: true, usedPicker: true };
  } catch (error) {
    return { saved: false, error };
  }
};

export const parseDrawioMessage = (data) => {
  if (typeof data !== "string" || !data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const isTrustedDrawioMessage = (event, iframe) =>
  event.origin === DRAWIO_ORIGIN &&
  Boolean(iframe?.contentWindow) &&
  event.source === iframe.contentWindow;

export const postDrawioMessage = (iframe, message) => {
  if (!iframe?.contentWindow) return false;

  iframe.contentWindow.postMessage(JSON.stringify(message), DRAWIO_ORIGIN);
  return true;
};

export const createDrawioLoadAction = (storageKey) => ({
  action: "load",
  xml: readDrawioXml(storageKey),
  autosave: 1,
  noExitBtn: 1,
  saveAndExit: 0,
});
