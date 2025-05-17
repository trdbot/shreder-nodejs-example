import Client, {
  type SubscribeTransactionsRequest,
} from "@shreder_xyz/grpc-client";
import { utils } from "@project-serum/anchor";

async function main() {
  const client = new Client("http://fra1.shreder.xyz:9991", {});
  const stream = await client.subscribe();

  const streamClosed = new Promise<void>((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
      stream.end();
    });
    stream.on("end", () => {
      resolve();
    });
    stream.on("close", () => {
      resolve();
    });
  });

  stream.on("data", (data) => {
    const signatures = data.transaction.transaction.signatures.map((s: Buffer) =>
      utils.bytes.bs58.encode(s),
    );
    console.log(
      new Date().toISOString(),
      data,
      signatures
    );

  });

  const request: SubscribeTransactionsRequest = {
    transactions: {
      pumpfun: {
        accountInclude: [],
        accountExclude: [],
        accountRequired: ["6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"],
      },
    },
  };
  await new Promise<void>((resolve, reject) => {
    stream.write(request, (err) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });

  await streamClosed;
}

main();
