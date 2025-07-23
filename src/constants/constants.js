export const temperatureIncrementedDecrementedDebounceTime = 1000;
export const localStorageKey = "projectOnyxVapeApp";
export const patreonLink = "https://www.patreon.com/ImACoderImACoderImACoder";
export const githubLink = "https://github.com/ImACoderImACoderImACoder";
export const redditLink = "https://www.reddit.com/user/ImACoderImACoder";
export const twitterLink = "https://twitter.com/ImmACoder";
export const cashAppLink = "https://cash.app/$imacoderimacoder";
export const instagramLink =
  "https://www.instagram.com/imacoderimacoderimacoder";
export const defaultTemperatureArray = [];
export const defaultGlobalFanOnTimeInSeconds = 36.5;
export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|WebBLE|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const WHIP_WAIT_TIME = 200;
export const defaultWorkflows = [
  {
    id: 1,
    name: "Vapesuvius Temp Step ⏪",
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 179,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 230,
              nextTemp: 217,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 217,
              nextTemp: 211,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 211,
              nextTemp: 205,
              wait: 5,
            },
            {
              id: 4,
              ifTemp: 205,
              nextTemp: 199,
              wait: 5,
            },
            {
              id: 5,
              ifTemp: 199,
              nextTemp: 191,
              wait: 5,
            },
            {
              id: 6,
              ifTemp: 191,
              nextTemp: 185,
              wait: 5,
            },
            {
              id: 7,
              ifTemp: 185,
              nextTemp: 179,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOnGlobal", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
  {
    id: 2,
    name: "Vapesuvius Temp Step", //curtesy of Vapesuvius https://i.redd.it/03vbzulhmjhb1.png
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 179,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 179,
              nextTemp: 185,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 185,
              nextTemp: 191,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 191,
              nextTemp: 199,
              wait: 5,
            },
            {
              id: 4,
              ifTemp: 199,
              nextTemp: 205,
              wait: 5,
            },
            {
              id: 5,
              ifTemp: 205,
              nextTemp: 211,
              wait: 5,
            },
            {
              id: 6,
              ifTemp: 211,
              nextTemp: 217,
              wait: 5,
            },
            {
              id: 7,
              ifTemp: 217,
              nextTemp: 230,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOn", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
];

export const premadeWorkflows = [
  {
    id: 1,
    name: "Vapesuvius Temp Step", //curtesy of Vapesuvius https://i.redd.it/03vbzulhmjhb1.png
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 179,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 179,
              nextTemp: 185,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 185,
              nextTemp: 191,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 191,
              nextTemp: 199,
              wait: 5,
            },
            {
              id: 4,
              ifTemp: 199,
              nextTemp: 205,
              wait: 5,
            },
            {
              id: 5,
              ifTemp: 205,
              nextTemp: 211,
              wait: 5,
            },
            {
              id: 6,
              ifTemp: 211,
              nextTemp: 217,
              wait: 5,
            },
            {
              id: 7,
              ifTemp: 217,
              nextTemp: 230,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOnGlobal", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
  {
    id: 2,
    name: "Vapesuvius Temp Step ⏪",
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 179,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 230,
              nextTemp: 217,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 217,
              nextTemp: 211,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 211,
              nextTemp: 205,
              wait: 5,
            },
            {
              id: 4,
              ifTemp: 205,
              nextTemp: 199,
              wait: 5,
            },
            {
              id: 5,
              ifTemp: 199,
              nextTemp: 191,
              wait: 5,
            },
            {
              id: 6,
              ifTemp: 191,
              nextTemp: 185,
              wait: 5,
            },
            {
              id: 7,
              ifTemp: 185,
              nextTemp: 179,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOnGlobal", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
  {
    id: 3,
    name: "Temp Step Whip Loop Full Session", //curtesy of Vapesuvius https://i.redd.it/03vbzulhmjhb1.png
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 179,
            wait: WHIP_WAIT_TIME,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 179,
              nextTemp: 185,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 2,
              ifTemp: 185,
              nextTemp: 191,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 3,
              ifTemp: 191,
              nextTemp: 199,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 4,
              ifTemp: 199,
              nextTemp: 205,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 5,
              ifTemp: 205,
              nextTemp: 211,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 6,
              ifTemp: 211,
              nextTemp: 217,
              wait: WHIP_WAIT_TIME,
            },
            {
              id: 7,
              ifTemp: 217,
              nextTemp: 230,
              wait: WHIP_WAIT_TIME,
            },
          ],
        },
      },
      { type: "exitWorkflowWhenTargetTemperatureIs", id: 2, payload: 230 },
      { type: "heatOff", id: 3 },
      { type: "loopFromBeginning", id: 4 },
    ],
  },
  {
    id: 4,
    name: "Temp Step Dosing capsule", //curtesy of Vapesuvius https://i.redd.it/03vbzulhmjhb1.png
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 185,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 185,
              nextTemp: 197,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 197,
              nextTemp: 211,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 211,
              nextTemp: 230,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOnGlobal", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
  {
    id: 5,
    name: "Temp Step Dosing Capsule ⏪", //curtesy of Vapesuvius https://i.redd.it/03vbzulhmjhb1.png
    payload: [
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 185,
            wait: 5,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 197,
              nextTemp: 185,
              wait: 5,
            },
            {
              id: 2,
              ifTemp: 211,
              nextTemp: 197,
              wait: 5,
            },
            {
              id: 3,
              ifTemp: 230,
              nextTemp: 211,
              wait: 5,
            },
          ],
        },
      },
      { type: "fanOnGlobal", id: 2, payload: 34 },
      { type: "heatOff", id: 3 },
    ],
  },
  {
    id: 6,
    name: "Developer's Special",
    payload: [
      { type: "setLEDbrightness", id: 1, payload: 70 },
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 180,
            wait: 0,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 180,
              nextTemp: 185,
              wait: 0,
            },
            {
              id: 2,
              ifTemp: 185,
              nextTemp: 190,
              wait: 0,
            },
            {
              id: 3,
              ifTemp: 190,
              nextTemp: 195,
              wait: 0,
            },
            {
              id: 4,
              ifTemp: 195,
              nextTemp: 200,
              wait: 0,
            },
          ],
        },
      },
      { type: "fanOn", id: 4, payload: 3.75 },
      { type: "fanOn", id: 5, payload: 0.5 },
      { type: "fanOn", id: 6, payload: 0.5 },
      { type: "fanOn", id: 7, payload: 0.5 },
      { type: "fanOnGlobal", id: 8, payload: 34 },
      { type: "heatOff", id: 9 },
      { type: "setLEDbrightness", id: 10, payload: 0 },
    ],
  },
  {
    id: 7,
    name: "Developer's Special Reverse ⏪",
    payload: [
      { type: "setLEDbrightness", id: 1, payload: 70 },
      {
        type: "heatOnWithConditions",
        id: 1,
        payload: {
          default: {
            temp: 180,
            wait: 0,
          },
          conditions: [
            {
              id: 1,
              ifTemp: 185,
              nextTemp: 180,
              wait: 0,
            },
            {
              id: 2,
              ifTemp: 190,
              nextTemp: 185,
              wait: 0,
            },
            {
              id: 3,
              ifTemp: 195,
              nextTemp: 190,
              wait: 0,
            },
            {
              id: 4,
              ifTemp: 200,
              nextTemp: 195,
              wait: 0,
            },
          ],
        },
      },
      { type: "fanOn", id: 4, payload: 3.75 },
      { type: "fanOn", id: 5, payload: 0.5 },
      { type: "fanOn", id: 6, payload: 0.5 },
      { type: "fanOn", id: 7, payload: 0.5 },
      { type: "fanOnGlobal", id: 8, payload: 34 },
      { type: "heatOff", id: 9 },
      { type: "setLEDbrightness", id: 10, payload: 0 },
    ],
  },
  {
    id: 8,
    name: "Really Off",
    payload: [
      { type: "heatOff", id: 1 },
      { type: "setLEDbrightness", id: 2, payload: 0 },
    ],
  },
  {
    id: 9,
    name: "Really On",
    payload: [
      { type: "heatOn", id: 1, payload: null },
      { type: "setLEDbrightness", id: 2, payload: 70 },
    ],
  },
];
