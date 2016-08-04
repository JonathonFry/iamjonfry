+++
date = "2016-08-03T23:23:29+01:00"
tags = ["code"]
title = "Automating hugo deployment to S3"
slug = "automating-hugo-deployment-to-s3"
+++

After making the decision to migrate from [hugo to ghost](http://iamjonfry.com/migrating-from-ghost-to-hugo/) I also decided to test the waters with AWS (Amazon web services) for my website hosting.

[S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/Welcome.html), a service on AWS, provides static website hosting, and as hugo generates static web files it's a perfect match.
The following are roughly the steps that I made to automate the deployment of a hugo site to S3.

**Step 1** - Create a bucket on S3 using your domain name:

bucket name = `<domain_name>`

This was important for me as I ran into an issue here where I had named my bucket `iamjonfry` instead of `iamjonfry.com` so my DNS settings were not working correctly when using CloudFlare.

> _Amazon requires that the CNAME match the bucket name._

[See here](https://support.cloudflare.com/hc/en-us/articles/200168926-How-do-I-use-CloudFlare-with-Amazon-s-S3-Service-) for more information.

**Step 2** - Apply a [bucket policy to allow public access](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html) to objects in the bucket (bucket -> properties -> permissions):

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "PublicReadGetObject",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::<bucket_name>/*"
		}
	]
}
```
**Step 3** - Enable website hosting and apply redirection rules for the index.html and 404.html pages(bucket -> properties -> static website hosting):

* Select `Enable website hosting`
* Set index document to `index.html`
* Set error document to `404.html`
* Edit the redirection rules (thanks to [this blog](https://lustforge.com/2016/02/27/hosting-hugo-on-aws/) for pointing me in the right direction)

```xml
<RoutingRules>
    <RoutingRule>
        <Condition>
            <KeyPrefixEquals>/</KeyPrefixEquals>
        </Condition>
        <Redirect>
            <ReplaceKeyPrefixWith>index.html</ReplaceKeyPrefixWith>
        </Redirect>
    </RoutingRule>
</RoutingRules>

```

At this point you should be able to view your website using the endpoint URL listed in the static website hosting section on AWS, it will look something like this:
`Endpoint: <bucket_name>.s3-website-<region>.amazonaws.com`

It's important to note that the URL you use should contain `-website-` as I ran into a few problems here where the redirection rules do not apply correctly without it. ([link to stackoverflow post](http://stackoverflow.com/a/24377823/1022454))

If you are happy to just manually upload your website static files any time you make changes you can stop, upload the output of `hugo` (located in the `/public` folder) to S3 and you are good to go.

**Step 4** - Create a [GitHub repository](https://github.com/new) for your hugo site. (Bitbucket also works)

**Step 5** - Create a [wercker](http://wercker.com/) account and add your website as a project. This is much easier for public projects as wercker can clone as a public user without the need for access. There is a [great blog](https://gohugo.io/tutorials/automated-deployments/) on hugo's website demonstrating how to set up hugo and wercker for automating deployment to GitHub pages.

**Step 6** - Create an IAM user for wercker. This is used to deploy to the S3 bucket.

The plugin used on wercker to sync to s3, `s3sync`, has some great information on [how to set up an IAM user with the correct permissions](https://app.wercker.com/#applications/51c82a063179be4478002245/tab/details).
The user requires the following permissions to sync to the bucket:
```json
{
  "Statement": [
    {
      "Action": [
        "s3:DeleteObject",
        "s3:GetObject",
        "s3:GetObjectAcl",
        "s3:ListBucket",
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Effect": "Allow",
      "Resource": [
          "arn:aws:s3:::<bucket_name>",
          "arn:aws:s3:::<bucket_name>/*"
      ]
    }
  ]
}
```
**Step 7** - Create an AWS access key using the IAM user you just created.

**Step 8** - Add the AWS access keys to your wercker project as environment variables (project -> settings -> environment variables).
As we are potentially hosting the source of the hugo project publicly we don't want to expose any sensitive information there, especially not AWS access keys.

Important to note that thanks to [this blog post](http://danbahrami.io/articles/wercker-s3-workflow-hugo-deploy/) I discovered that the bucket-url for s3sync is required to be in the format `s3://<bucket_name>`.

**Step 9** - Modify your wercker.yml file to use the environment variables we added to wercker:

```yaml
box: debian
build:
  steps:
    - arjen/hugo-build:
        version: "0.16"
        theme: <theme_name>
    - s3sync:
        source_dir: public/
        delete-removed: true
        bucket-url: $AWS_BUCKET_URL
        key-id: $AWS_ACCESS_KEY_ID
        key-secret: $AWS_SECRET_ACCESS_KEY

```

**Step 10** - Profit..? Nah, this should be it. Now when we push to git, wercker should pick up on the changes, execute the hugo build, and sync the output from the `/public` folder to our specified S3 bucket.

**Step 11** - Bonus round - using a custom domain.

* Create an account on [CloudFlare](https://www.cloudflare.com/)
* Add your website to CloudFlare
* Apply the CloudFlare nameservers to your domain
* Add a CNAME to your DNS records

```
name : <bucket_name>

value : <bucket_name>.s3-website-<region>.amazonaws.com
```
Now all we have to do is wait for the DNS changes to propagate and we're all set. You should now have your hugo website hosted on S3, automated deployments using git, and a custom domain using CloudFlare's DNS.

J
