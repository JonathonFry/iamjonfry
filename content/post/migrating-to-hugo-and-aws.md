+++
date = "2016-08-02T21:45:48+01:00"
tags = ["code"]
title = "Migrating from ghost to hugo"
slug = "migrating-from-ghost-to-hugo"
+++

I've been happily running a VPS on [DigitalOcean](https://m.do.co/c/0804cbb4b4ab) for over 3 years and last year I started running [iamjonfry.com](http://iamjonfry.com)  using the Ghost blogging platform.
Over the weekend I decided to upgrade to Ghost to the latest version, [v0.9.0](https://dev.ghost.org/ghost-0-9-0/), however I ran into quite a few issues during the upgrade process (spoiler alert node package manager - npm).

I first updated to the latest supported version of node.js **`4.4.7`**, and NPM **`3.10.5`**.
After downloading and extracting the ghost zip, running
```bash
npm-install --production
```
would mysteriously end with
```bash
Killed
```
After a bit of research (google) I came across others who had experienced the same thing [here](https://www.digitalocean.com/community/questions/npm-gets-killed-no-matter-what) and [here](https://github.com/npm/npm/issues/9005). It turns out that my droplet was OOM(out of memory) whilst attempting to install the dependencies.

> You need more ram - *helpful*

A temporary fix to this (aka hack) is to create a swap file to be used when the system runs out of memory. I followed a tutorial [here](https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04) and it worked as expected allowing me to install the dependencies. However, this annoyed me as I really can't justify having to create a swap file to install dependencies for something as simple as a blog. Plus, watching NPM download half the internet as dependencies was the last straw and motivated me to find a 'better' option.
\*_The work that is done on Ghost is **excellent** and I don't want to detract in any way from what they are doing_.

After some research on static site generators, of which there are many, I came across [hugo](https://gohugo.io/) which is a static site generator written in Go. As I am fond of Go and always looking to tinker with it, it seemed like a great fit.

From zero-to-blog is as easy as installing hugo with brew

```bash
brew install hugo
```

Cloning a theme (in my case the simple but delightful [hugo-lithium-theme](http://themes.gohugo.io/hugo-lithium-theme/))

```bash
git clone https://github.com/jrutheiser/hugo-lithium-theme
```

and running it

```bash
hugo server
```

As ghost posts are written in markdown, and hugo also uses markdown, migration of my old blog posts was as easy as copying the files over. I don't have any complex tags or setup with ghost so your milage may vary. Whilst moving my blog to using hugo I decided to also move to using AWS instead of DigitalOcean. This was primarily driven by learning as I wanted to experiment with deploying something live to AWS (I still maintain my [DigitalOcean](https://m.do.co/c/0804cbb4b4ab) droplet).

I intend to write up a follow-up blog post to this showing how I deployed my website to S3 on AWS, and used [wercker](http://wercker.com/) to automate the deploy process with GitHub.

You can find the source for this blog hosted on [GitHub](https://github.com/JonathonFry/iamjonfry).

J
