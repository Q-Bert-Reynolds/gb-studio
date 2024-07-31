import { createReadStream } from "fs-extra";
import crypto from "crypto";
import SparkMD5 from "spark-md5";

export const checksumFile = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha1");
    const stream = createReadStream(path);
    stream.on("error", (err) => reject(err));
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
};

export const checksumMD5File = (path: string): Promise<string> => {
  console.log("CHECKSUM FILE", path);
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer();
    const stream = createReadStream(path);
    stream.on("error", (err) => reject(err));
    stream.on("data", (chunk: ArrayBuffer) => {
      console.log("GOT CHUNK", chunk);
      spark.append(chunk);
    });
    stream.on("end", () => resolve(spark.end()));
  });
};

export const checksumString = (string: string): string => {
  const hash = crypto.createHash("sha1");
  hash.update(string);
  return hash.digest("hex");
};

export const checksumJSON = (obj: unknown): string => {
  const hash = crypto.createHash("sha1");
  hash.update(JSON.stringify(obj));
  return hash.digest("hex");
};

export const mergeChecksums = (checksums: string[]): string => {
  const hash = crypto.createHash("sha1");

  for (let i = 0; i < checksums.length; i++) {
    hash.update(checksums[i]);
  }

  return hash.digest("hex");
};
