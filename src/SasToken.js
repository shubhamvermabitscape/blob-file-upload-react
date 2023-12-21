const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

async function generateSasToken(
  accountName,
  accountKey,
  containerName,
  blobName
) {
  // Create a shared key credential
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );

  // Create a BlobServiceClient using the shared key credential
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  // Get a reference to the container and blob
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Set the SAS token expiration time
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 60); // Token will expire in 1 hour

  // Define the permissions for the SAS token
  const permissions = {
    read: true, // Allow read access to the blob
    // Add more permissions as needed
  };

  // Generate the SAS token
  const sasToken = blobClient.generateSasUrl({
    expiresOn: expirationTime,
    permissions: permissions,
  });

  return sasToken;
}

// Example usage
const accountName = import.meta.env.VITE_STORAGE_ACCOUNT;
const accountKey = import.meta.env.VITE_STORAGE_ACCOUNT_KEY;
const containerName = import.meta.env.VITE_STORAGE_CONTAINER;
const blobName = "cmdimg1.png";

export const generatedSasToken = generateSasToken(
  accountName,
  accountKey,
  containerName,
  blobName
)
  .then((sasToken) => {
    console.log(`SAS Token: ${sasToken}`);
    return sasToken;
  })
  .catch((error) => {
    console.error(error.message);
    return error.message;
  });
