---
date: 2017-10-22T14:00:20+01:00
title: "Custom timeouts with retrofit"
slug: "custom-timeouts-with-retrofit"
tags: [ "code" ]
---


I recently ran into the problem of customising timeouts for different API calls when using [retrofit](http://square.github.io/retrofit/). 
<!--more-->

Ideally, you would be able to specify a timeout using a custom annotation.

{{< highlight kotlin >}}
interface Api {
    @Timeout(60000)
    @GET("users/{user}/repos")
    fun listRepos(@Path("user") user: String): Call<List<Repo>>
}
{{< /highlight >}}

However, without creating a wrapper around retrofit this isn't possible.

Instead I created a custom [interceptor](https://square.github.io/okhttp/3.x/okhttp/okhttp3/Interceptor.html) that uses the `@Headers` annotation to parse timeouts. (This will override the default timeouts you have set on your OkHttpClient)

{{< highlight kotlin >}}
class TimeoutInterceptor : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()

        val timeout = request.header("X-Timeout")?.toInt() ?: 0

        return if (timeout > 0) {
            chain.withWriteTimeout(timeout, TimeUnit.MILLISECONDS)
                    .withReadTimeout(timeout, TimeUnit.MILLISECONDS)
                    .withConnectTimeout(timeout, TimeUnit.MILLISECONDS)
                    .proceed(request.newBuilder().removeHeader("X-Timeout").build())
        } else {
            chain.proceed(request)
        }
    }
}
{{< /highlight >}}

To use this you add a header with your timeout to the API declaration. The interceptor will consume this and apply the custom timeout to the chain.

{{< highlight kotlin >}}
@Headers("X-Timeout: 60000")
@GET("users/{user}/repos")
fun listRepos(@Path("user") user: String): Call<List<Repo>>
{{< /highlight >}}

Don't forget to add your interceptor to your [OkHttpClient](https://square.github.io/okhttp/3.x/okhttp/okhttp3/OkHttpClient.html)

{{< highlight kotlin >}}
val client = OkHttpClient.Builder()
        .addInterceptor(TimeoutInterceptor())
        .build()

val retrofit = Retrofit.Builder()
        .baseUrl("https://api.github.com/")
        .client(client)
        .build()

val service = retrofit.create(GitHubService::class.java)
{{< /highlight >}}

This functionality was added in [OkHttp 3.9.0](https://github.com/square/okhttp/releases/tag/parent-3.9.0) so ensure you are targeting the latest version.
