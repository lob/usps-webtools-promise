import https from "https";
import { create } from "xmlbuilder2";

// This function runs the actual request. I've abstracted it out so it
// can be used independently of AWS
export default async (options: string | https.RequestOptions | URL) =>
  new Promise((resolve) => {
    // This is the actual request
    const request = https.request(options, (response) => {
      let body = "";
      // eslint-disable-next-line no-return-assign
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => {
        try {
          const xml = create(body);
          // console.log(body);
          resolve(xml.end({ format: "object" }));
        } catch (error) {
          throw new Error(error);
        }
      });
    });

    // This deals with errors
    request.on("error", (error) => {
      throw new Error(JSON.stringify(error));
    });

    // This ends the request
    request.end();
  });
