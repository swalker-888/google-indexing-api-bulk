# google-indexing-api-bulk

Created by Steve at [Journey Further SEO](https://www.journeyfurther.com/)

Requires node.js - https://nodejs.org/en/download/

This script will help you index your website's pages in bulk, without having to manually request each URL for submission in the Search Console interface.

First off you will need to set up access to the Indexing API in Google Cloud Platform - follow the instructions below.

https://developers.google.com/search/apis/indexing-api/v3/prereqs

Once you have access to Indexing API you'll be able to download a public/private key pair JSON file, this contains all of your credentials and should be saved as "service_account.json".

Add the URLs to the urls.txt file that you need to be crawled/indexed.


## Verify site ownership in Search Console to submit URLs for indexing
In this step, you'll verify that you have control over your web property.

To verify ownership of your site you'll need to add your service account email address (see service_account.json - client_email) and add it as an owner ('delegated') of the web property in Search Console.

You can find your service account email address in two places:
- The client_email field in the JSON private key that you downloaded when you created your project.
- The Service account ID column of the Service Accounts view in the Developer Console.
- The email address has a format similar to the following:

For example, "my-service-account@test-project-42.google.com.iam.gserviceaccount.com".

Then...

1. Go to [Google Webmaster Central](https://www.google.com/webmasters/verification/home)
2. Click your verified property
3. Scroll down and click 'Add an owner'.
4. Add your service account email address as an owner to the property.


## Quotas

100 URLs per request batch

200 URLs per day
