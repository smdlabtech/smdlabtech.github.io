---
title: Python async/await — optimize your I/O-bound applications
date: 2024-12-05
author: Daya SYLLA
category: Python
tags: [Python, Async, Asyncio, Performance, Concurrency]
---

# Python async/await — optimize your I/O-bound applications

Python's asyncio lets you write efficient concurrent code for I/O-bound work. Here is how to use it to improve application performance.

## Why async/await?

### The problem with classic threading

Threading in Python is limited by the GIL (Global Interpreter Lock) for CPU-bound parallel work. For I/O (network, files, databases), async/await is usually far more efficient.

### Benefits of asyncio

- **Concurrency**: handle many simultaneous connections
- **Performance**: lower overhead than threading
- **Clarity**: readable syntax

## Core concepts

### Coroutines

```python
import asyncio

async def fetch_data(url: str):
    # Simulated HTTP request
    await asyncio.sleep(1)
    return f"Data from {url}"

# Run
result = await fetch_data("https://api.example.com")
```

### Event loop

The event loop schedules coroutines:

```python
async def main():
    tasks = [
        fetch_data("url1"),
        fetch_data("url2"),
        fetch_data("url3")
    ]
    results = await asyncio.gather(*tasks)
    return results

results = asyncio.run(main())
```

## Practical use cases

### 1. Concurrent HTTP requests

```python
import aiohttp
import asyncio

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.json()

async def fetch_multiple(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)
```

### 2. Database access

```python
import asyncpg

async def fetch_users():
    conn = await asyncpg.connect('postgresql://...')
    users = await conn.fetch('SELECT * FROM users')
    await conn.close()
    return users
```

### 3. File I/O

```python
import aiofiles

async def read_file(filepath):
    async with aiofiles.open(filepath, 'r') as f:
        content = await f.read()
    return content
```

## Performance: async vs threading

For 1,000 HTTP requests:
- **Threading**: ~10 seconds (GIL and overhead)
- **Async**: ~1 second (efficient concurrency)

## Best practices

1. **Use async/await for I/O**: network, files, databases
2. **Avoid for CPU-bound work**: use multiprocessing instead
3. **Handle errors**: try/except inside coroutines
4. **Limit concurrency**: use semaphores to avoid overload

```python
semaphore = asyncio.Semaphore(10)

async def limited_fetch(url):
    async with semaphore:
        return await fetch(url)
```

## Conclusion

Async/await makes Python a strong choice for I/O-bound applications. Master these patterns to build fast, scalable services.
