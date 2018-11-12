---
date: 2018-11-12T23:53:54+01:00
title: "Danger on Android"
slug: "danger-android"
tags: [ "code" ]
---

A team I have been working with recently has grown to a big enough size that we decided to improve the pull request (PR) process with continuous integration (CI) by introducing Danger.

> [Danger](https://github.com/danger/danger) runs during your CI process, and gives teams the chance to automate common code review chores.

Getting started with Danger can be fairly simple, depending on where you host your repository, and what CI tool you use. 
I setup Danger to run on a Bitbucket repository using Bitrise CI. 
_note - danger requires Ruby._

##Step 1 - Create your Gemfile

Run `bundler init` to create a `Gemfile` in your project.

Add the danger gem to the `Gemfile`.

```ruby
gem 'danger'
```

The gemfile is used by Ruby to declare a list of dependencies. This is where we will add our plugins to Danger.

##Step 2 - Install Danger
Install the Danger gem.
```ruby
bundle install
```

##Step 3 - Create a Dangerfile
Create a file called `Dangerfile` in the root of your project.
To start with, add a basic 'hello world' to the Dangerfile.
```ruby
message("Hello world")
```

##Step 4 - Integrate with CI

This step is a guide to integrating with Bitrise. 

Add a `Script` step to your workflow after your gradle build has completed:

[](./script-step.png)

```bash
#!/usr/bin/env bash
# fail if any commands fails
set -e
# debug log
set -x

ghprbPullId=${PULL_REQUEST_ID}
bundle install
bundle exec danger --verbose
```

WIP blog post of set up process integrating Danger into Bitrise with bitbucket


https://blog.bitrise.io/danger-danger-uh-that-is-using-danger-with-bitrise

https://danger.systems/guides/getting_started.html

https://github.com/orta/danger-junit

https://github.com/loadsmart/danger-android_lint

https://github.com/noboru-i/danger-checkstyle_format

https://github.com/Malinskiy/danger-jacoco

https://medium.com/@emmaguy/tracking-android-app-metrics-431cbea2113d

https://github.com/danger/awesome-danger

https://github.com/operando/AndroidDangerSample/blob/master/Dangerfile

https://medium.com/@p.tournaris/building-a-helpful-android-ci-with-danger-jenkins-bf751be7a74c