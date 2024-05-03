import { Lane } from "@/types/linetype";
import { Card } from "@/types/cardtype";

const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const apiGetRequestHandler = async (
  endpoint: string,
  param?: string
) => {
  try {
    const snapshot = await fetch(API_URL + endpoint, {
      method: "GET",

      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (snapshot.ok) {
      let data = await snapshot.json();

      return data;
    } else {
      console.log("Data not available");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const apiPostRequestHandler = async <T>(
  endpoint: string,
  payload?: T,
  param?: number
): Promise<T | null | undefined> => {
  let snapshot;

  try {
    console.log("endpoint: ", endpoint, "payload: ", payload, "param", param);

    if (param && API_URL) {
      snapshot = await fetch(API_URL + endpoint + "?id=" + param, {
        method: "POST",

        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else if (API_URL) {
      snapshot = await fetch(API_URL + endpoint, {
        method: "POST",

        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    if (snapshot)
      if (snapshot.ok) {
        let data = await snapshot.json();
        console.log("data to be returned: ", data);

        return data;
      } else {
        console.log("Data not available");
        return null;
      }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const apiDeleteRequestHandler = async <T>(
  endpoint: string,
  param: string
) => {
  if (param && API_URL) {
    return fetch(API_URL + endpoint + "?id=" + param, {
      method: "DELETE",
      headers: {
        "x-api-key": API_KEY,
      },
    })
      .then((response) => {
        return response.status;
      })
      .catch((error) => {
        return error;
      });

    // fetch(API_URL+tobeDeleted)
  }
};
