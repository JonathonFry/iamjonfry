+++
date = "2016-03-10T15:45:47+01:00"
title = "Mobile engineers and microservices"
slug = "mobile-engineers-and-microservices"
tags = [ "code" ]
+++

Microservices are becoming increasingly popular, and with the surge in cloud services (see [Amazon Web Services](http://aws.amazon.com/) / [Google Cloud Platform](https://cloud.google.com/)), they're something that all engineers should be interested in.

Being primarily a mobile developer I don't get a lot of exposure to writing production back-end code, so i'm trying to be proactive and develop  skills through personal projects.
I think it's important that mobile developers don't limit themselves to _just_ front-end work. It's very powerful to be able to spin up a microservice to wrap a bad API endpoint and transform it into a good one.

I've only previously dipped my toe into the world of microservices using node.js and python but i've read a lot of lovely things about [Go](https://golang.org/), and wanted to try creating something myself.

With just a few lines of code you can spin up an endpoint and return the infamous `hello world`.

<script src="https://gist.github.com/JonathonFry/b4abcb05be4b55ceaab5.js"></script>

To deploy this to a server you first use `go build` to create a binary file. This will output an executable called `main` that we can then use to execute. That's it. (You can tweak the compilation options to build for different architectures)

Building on this I recently added RSVP functionality to my wedding website [frywedding.com/rsvp](http://frywedding.com/rsvp.html) using Go. I'll open source this code on GitHub once the RSVP's are finished.

J
