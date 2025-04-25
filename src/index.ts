import Client, {
  type SubscribeTransactionsRequest,
} from "@shreder_xyz/grpc-client";

async function main() {
  const client = new Client("http://localhost:9991", {});
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
    console.log(data);
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
