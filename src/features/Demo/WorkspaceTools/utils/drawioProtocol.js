export const DRAWIO_ORIGIN = "https://embed.diagrams.net";

export const DRAWIO_EMBED_URL =
  `${DRAWIO_ORIGIN}/?embed=1&ui=min&spin=1&proto=json`;

const EMPTY_DRAWIO_XML =
  '<mxfile host="LinCo"><diagram id="linco-blank" name="Page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>';

export const createDrawioStorageKey = (scope) =>
  `linco:drawio:${encodeURIComponent(scope)}`;

export const readDrawioXml = (storageKey) => {
  if (!storageKey) return EMPTY_DRAWIO_XML;

  try {
    return window.localStorage.getItem(storageKey) || EMPTY_DRAWIO_XML;
  } catch {
    return EMPTY_DRAWIO_XML;
  }
};

export const persistDrawioXml = (storageKey, xml) => {
  if (!storageKey || typeof xml !== "string" || !xml) return false;

  try {
    window.localStorage.setItem(storageKey, xml);
    return true;
  } catch {
    return false;
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
