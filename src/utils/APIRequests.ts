import { Lane } from "@/types/linetype";
import { Card } from "@/types/cardtype";

const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const apiGetRequestHandler = async (
  endpoint: string,
  caller: string
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
  payload?: T
): Promise<Card | Lane | null | undefined> => {
  //let snapshot: Response;

  try {
    if (API_URL) {
      const snapshot = await fetch(API_URL + endpoint, {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (snapshot.ok) {
        const data = await snapshot.json();
        return data as Card | Lane;
      } else {
        console.log("Data not available");
        return null;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const apiPutRequestHandler = async <T>(endpoint: string) => {
  if (endpoint) {
    return fetch(API_URL + endpoint, {
      method: "PUT",
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
  }
};
export const apiDeleteRequestHandler = async <T>(
  endpoint: string,
  param: string = ""
) => {
  if (endpoint && API_URL) {
    console.log("hits here apiurl: ", API_URL, "endpoint: ", endpoint);

    return await fetch(API_URL + endpoint + param, {
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
  }
};
