---
date: 2019-05-26T10:30:00+01:00
title: "Lambdas in data classes"
slug: "lambdas-in-data-classes"
tags: [ "android", "code", "kotlin" ]
---


[Data classes](https://kotlinlang.org/docs/reference/data-classes.html) are a Kotlin feature that allow us to write clean, simple classes that are commonly used to model data, such as API requests/responses and application state. They have have automatically derived `equals()`, `hashCode()` and `toString()` functions. 

This is an example of a simple data class `Item` that holds an id, title and subtitle:

```kotlin
    data class Item(
        val id: String,
        val title: String,
        val subtitle: String
    )
```

On Android we might want to render a list of items in a `RecyclerView`: 
```kotlin
val items = listOf(
            Item(id = "id 1", title = "title 1", subtitle = "title 1"),
            Item(id = "id 2", title = "title 2", subtitle = "title 2")
        )
```

However it would be nice if we could also use this data class to pass a callback to listen for clicks. We can modify our original data class to add a [lambda](https://kotlinlang.org/docs/reference/lambdas.html) to achieve this:
```kotlin
val listener: (String) -> Unit
```
But we don't want to pass a **new** lambda into every `Item` as this would break equality checks which are important for performance when rendering a large list. This is because the `DiffUtil` used with `RecylerView` checks item contents for equality, commonly using `isEquals()`.

We can use a method reference in the data class to use the same function for every `Item`, this ensures the lambda usage doesn't break our equality checks and gives us a simple way of handling callbacks using data classes.

A concrete example of this is a `ViewModel` that could emit a list of items as state, containing a callback to the `ViewModel` for clicks:

```kotlin
class HomeViewModel : ViewModel() {

    init {
        val items = listOf(
            Item(id = "id 1", title = "title 1", subtitle = "title 1", listener = ::onClick),
            Item(id = "id 2", title = "title 2", subtitle = "title 2", listener = ::onClick)
        )
    }

    private fun onClick(id: String) {
        Timber.d("Do something with $id")
    }

    data class Item(
        val id: String,
        val title: String,
        val subtitle: String,
        val listener: (String) -> Unit
    )

}
```