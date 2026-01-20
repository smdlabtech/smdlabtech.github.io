import * as gcp from "@pulumi/gcp";

const project = "bq-small-corp";
const region = "europe-west1";

const backend = new gcp.cloudrunv2.Service("html-2pptx-backend", {
  location: region,
  project,
  template: {
    containers: [
      {
        image: "gcr.io/bq-small-corp/html-2pptx-backend:latest",
        envs: [
          { name: "ENVIRONMENT", value: "prod" },
          { name: "ENABLE_METRICS", value: "true" },
          { name: "OPENAI_API_KEY", valueSource: { secretKeyRef: { secret: "OPENAI_API_KEY", version: "latest" } } },
        ],
      },
    ],
  },
});

export const backendUrl = backend.uri;
