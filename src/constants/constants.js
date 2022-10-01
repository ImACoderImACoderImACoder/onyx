export const temperatureIncrementedDecrementedDebounceTime = 1000;
export const localStorageKey = "projectOnyxVapeApp";
export const patreonLink = "https://www.patreon.com/ImACoderImACoderImACoder";
export const githubLink = "https://github.com/ImACoderImACoderImACoder";
export const redditLink = "https://www.reddit.com/user/ImACoderImACoder";
export const twitterLink = "https://twitter.com/ImmACoder";
export const instagramLink =
  "https://www.instagram.com/imacoderimacoderimacoder";
export const defaultTemperatureArray = [];
export const defaultGlobalFanOnTimeInSeconds = 36.5;
export const defaultWorkflows = [
  {
    id: 1,
    name: "Workflow #1",
    payload: [
      { type: "heatOn", id: 1, payload: 185 },
      { type: "wait", id: 2, payload: 5 },
      { type: "fanOnGlobal", id: 3, payload: 36.5 },
      { type: "heatOff", id: 4 },
    ],
  },
  {
    id: 2,
    name: "Workflow #2",
    payload: [
      { type: "heatOn", id: 1, payload: 190 },
      { type: "wait", id: 2, payload: 5 },
      { type: "fanOnGlobal", id: 3, payload: 36.5 },
      { type: "heatOff", id: 4 },
    ],
  },
  {
    id: 3,
    name: "Workflow #3",
    payload: [
      { type: "heatOn", id: 1, payload: 195 },
      { type: "wait", id: 2, payload: 5 },
      { type: "fanOnGlobal", id: 3, payload: 36.5 },
      { type: "heatOff", id: 4 },
    ],
  },
  {
    id: 4,
    name: "Workflow #4",
    payload: [
      { type: "heatOn", id: 1, payload: 200 },
      { type: "wait", id: 2, payload: 5 },
      { type: "fanOnGlobal", id: 3, payload: 36.5 },
      { type: "heatOff", id: 4 },
    ],
  },
];
