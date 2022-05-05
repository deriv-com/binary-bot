import { TrackJS } from "trackjs";
import { observer as globalObserver } from "../../common/utils/observer";
import { isProduction } from "../../common/utils/tools";
import { isIOS } from "./osDetect";

const log = (type, ...args) => {
  if (type === "warn") {
    console.warn(...args); // eslint-disable-line no-console
  } else {
    console.log(...args); // eslint-disable-line no-console
  }
  const date = new Date();
  const timestamp = `${date.toISOString().split("T")[0]} ${date.toTimeString().slice(0, 8)} ${
    date.toTimeString().split(" ")[1]
  }`;
  globalObserver.emit("bot.notify", { type, timestamp, message: args.join(":") });
};

const notify = ({ className, message, position = "left", sound = "silent" }) => {
  log(className, message);

  // TODO: remove jquery dependency
  $.notify(message.toString(), { position: `bottom ${position}`, className });

  if (sound !== "silent" && !isIOS()) {
    const audio = document.getElementById(sound);
    if(!audio && !audio.play) return;
    audio.play().catch(() => { });
  }
};

export class TrackJSError extends Error {
  constructor(type, message, optCustomData) {
    super(message);
    this.name = type;
    this.code = type;
    this.data = optCustomData;
  }
}

const notifyError = error => {
  if (!error) {
    return;
  }

  let message;
  let code;

  if (typeof error === "string") {
    code = "Unknown";
    message = error;
  } else if (error.error) {
    if (error.error.error) {
      ({ message } = error.error.error);
      ({ code } = error.error.error);
    } else {
      ({ message } = error.error);
      ({ code } = error.error);
    }
  } else {
    ({ message } = error);
    ({ code } = error);
  }

  // Exceptions:
  if (message === "Cannot read property 'open_time' of undefined") {
    // SmartCharts error workaround, don't log nor show.
    return;
  }

  notify({ className: "error", message, position: "right" });

  if (isProduction()) {
    TrackJS.track(code || error.error.code);
  }
};

const waitForNotifications = () => {
  const notifList = ["success", "info", "warn", "error"];

  globalObserver.register("Notify", notify);

  globalObserver.register("Error", notifyError);

  notifList.forEach(className =>
    globalObserver.register(`ui.log.${className}`, message => notify({ className, message, position: "right" }))
  );
};

const logHandler = () => {
  const userId = document.getElementById("active-account-name")?.value;
  if (userId) {
    TrackJS.configure({ userId });
  }

  waitForNotifications();
};

export default logHandler;
