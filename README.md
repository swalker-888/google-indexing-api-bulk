# google-indexing-api-bulk

## Create a project for your client

Before you can send requests to the Indexing API, you need to tell Google about your client and activate access to the API. You do this by using the Google API Console to create a project, which is a named collection of settings and API access information, and register your application.

To get started using Indexing API, you need to first use the setup tool, which guides you through creating a project in the Google API Console, enabling the API, and creating credentials.

## Create a service account

1. Open the Service accounts page. If prompted, select a project.
2. Click Create service account.
3. In the Create service account window, type a name for the service account, and select Furnish a new private key. If you want to grant G Suite domain-wide authority to the service account, also select Enable G Suite Domain-wide Delegation. Then click Save.

Your new public/private key pair is generated and downloaded to your machine; it serves as the only copy of this key. You are responsible for storing it securely.

## Verify site ownership in Search Console
In this step, you'll verify that you have control over your web property.

To verify ownership of your site:

1. Follow the recommended steps to verify ownership of your property.
2. After your property has been verified, open Search Console.
3. Click your verified property.
4. Select Verification details from the Settings gear next to your verified property.
Under Verified owners, click Add an owner.
5. Add your service account email address as an owner to the property. You can find your service account email address in two places:
6. The client_email field in the JSON private key that you downloaded when you created your project.
- The Service account ID column of the Service Accounts view in the Developer Console.
- The email address has a format similar to the following:

For example, "my-service-account@test-project-42.google.com.iam.gserviceaccount.com".
