import https from "https";
import { create } from "xmlbuilder2";
import USPSError from "./error";

// This function runs the actual request. I've abstracted it out so it
// can be used independently of AWS
export default async (
  options: string | https.RequestOptions | URL
): Promise<{}> => {
  return new Promise((resolve, reject) => {
    // This is the actual request
    const request = https.request(options, (response) => {
      let body = "";
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => {
        try {
          const xml = create(body);
          // console.log(body);
          resolve(xml.end({ format: "object" }));
        } catch (error) {
          reject(new USPSError("XML Parse", error, body));
        }
      });
    });

    // This deals with errors
    request.on("error", (error) => {
      reject(new USPSError("Request Error", error));
    });

    // This ends the request
    request.end();
  });
};
