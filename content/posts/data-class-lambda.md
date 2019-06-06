---
date: 2019-05-26T10:30:00+01:00
title: "Simplify your adapters - lambdas in data classes"
slug: "lambdas-in-data-classes"
tags: [ "android", "code", "kotlin" ]
cover: "/static/data-class-lambda-cover.jpg"
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

On Android we can use a data class to represent an item in a list. This list of data can be used by an adapter to render a `RecyclerView`: 
```kotlin
val items = listOf(
            Item(id = "id 1", title = "title 1", subtitle = "title 1"),
            Item(id = "id 2", title = "title 2", subtitle = "title 2")
        )
```

## Adapter click listeners
Setting a click listener to an adapter usually requires bindings for `Presenter/ViewModel <-> View <-> Adapter`.

We can simplify this by using a [lambda](https://kotlinlang.org/docs/reference/lambdas.html) inside a data class. 

Modifying our original data class to add a lambda:
```kotlin
val listener: (String) -> Unit
```
But we don't want to pass a **new** lambda into every `Item` as this would break equality checks which are important for performance when rendering a large list. This is because the `DiffUtil` used with `RecylerView` checks item contents for equality, commonly using `isEquals()`.

By using a method reference in the data class we can point to the same function for every `Item`, this ensures that lambda usage doesn't break our equality checks and gives us a simple way of handling callbacks using data classes.

An example of this is a `ViewModel` that emits a list of items as state, containing a callback to the `ViewModel` for clicks:

```kotlin
class HomeViewModel : ViewModel() {

    private var _data = MutableLiveData<State>()
    val data: LiveData<State> = _data

    init {
        val items = listOf(
                Item(id = "id 1", title = "title 1", subtitle = "subtitle 1", listener = ::onClick),
                Item(id = "id 2", title = "title 2", subtitle = "subtitle 2", listener = ::onClick)
        )
        _data.value = State(items = items)
    }

    private fun onClick(id: String) {
        Timber.d("Do something with $id")
    }

    data class State(val items: List<Item> = emptyList())
}

data class Item(
        val id: String,
        val title: String,
        val subtitle: String,
        val listener: (String) -> Unit
)
```
And the `Activity` that observes the `ViewModel.State`
```kotlin
class HomeActivity : AppCompatActivity() {

    private val adapter = Adapter()
    private val viewModel = HomeViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        homeRecyclerView.adapter = adapter

        viewModel.data.observe(this, Observer<HomeViewModel.State> { state ->
            adapter.submitList(state.items)
        })

    }

    class Adapter : ListAdapter<Item, Adapter.ViewHolder>(ItemDiff) {

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            return ViewHolder(LayoutInflater.from(parent.context).inflate(R.layout.item, parent, false))
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = getItem(position)
            holder.container.setOnClickListener { item.listener(item.id) }
            holder.titleTextView.text = item.title
            holder.subtitleTextView.text = item.subtitle
        }

        class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val container: LinearLayout = view.itemContainer
            val titleTextView: TextView = view.title
            val subtitleTextView: TextView = view.subtitle
        }

        object ItemDiff : DiffUtil.ItemCallback<Item>() {
            override fun areItemsTheSame(oldItem: Item, newItem: Item): Boolean {
                return oldItem.id == newItem.id
            }

            override fun areContentsTheSame(oldItem: Item, newItem: Item): Boolean {
                return oldItem == newItem
            }

        }
    }
}
```