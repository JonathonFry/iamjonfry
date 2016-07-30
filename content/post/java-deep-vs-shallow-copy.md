+++
date = "2014-05-17T20:05:17+01:00"
title = "Java - Deep copy vs Shallow copy"
slug = "java-deep-copy-vs-shallow-copy"
tags = [ "code" ]
+++

Today I stumbled across a problem where I was attempting to manipulate what I thought were two completely separate ArrayLists.

I had an existing ArrayList<Store> of custom Store objects.
I then proceeded to create a `new ArrayList<Store>` copying the data from the existing ArrayList using `.clone()`

Using `.clone()` to clone an ArrayList only creates a [*shallow copy*](http://en.wikipedia.org/wiki/Object_copy#Shallow_copy), which means that the ArrayList is new, but the objects contained are not, and point to the same object on the heap.
To clone an ArrayList and create new objects requires something called [*deep copying*](http://en.wikipedia.org/wiki/Object_copy#Deep_copy).

There are many ways to deep copy ArrayLists, I chose the quick and dirty option of implementing the [`Cloneable`](http://docs.oracle.com/javase/7/docs/api/java/lang/Cloneable.html) interface in my `Store` class.
