---
date: 2014-05-17T19:59:02+01:00
title: "Android - Creating a global Application Context"
slug: "global-application-context"
tags: [ "code" ]
---

Proper use of the Android context seems to be tricky to get right. A common problem is passing the context around unnecessarily.

An example of this, is when you are reading or writing files to disk, as this requires the context to do so. However, you do not want to pass the context into the method or class which you are using, so you can instead use a simple trick to gain access to the Application Context from anywhere.

To do this requires you to subclass the Application class.

<script src="https://gist.github.com/jonathonfry/75d5a50f3e4792e9939c.js"></script>

You also need to declare this in the application tag of your Android Manifest file

```java
<application android:name=".MyApplication"
       android:icon="@drawable/icon"
       android:label="@string/app_name">
```
