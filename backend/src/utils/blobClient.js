'use strict';

const { BlobServiceClient } = require('@azure/storage-blob');

function createBlobServiceClient(connectionString) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

  // Request Policy Factory to force the x-ms-version header to 2020-10-02 for Azurite compatibility
  const forceApiVersionPolicyFactory = {
    create: (nextPolicy, options) => {
      return {
        sendRequest: async (request) => {
          request.headers.set('x-ms-version', '2020-10-02');
          return nextPolicy.sendRequest(request);
        }
      };
    }
  };

  // Inject into pipeline factories and clear the cached pipeline to force recompilation
  blobServiceClient.pipeline.factories.push(forceApiVersionPolicyFactory);
  delete blobServiceClient.pipeline._corePipeline;

  return blobServiceClient;
}

module.exports = { createBlobServiceClient };
