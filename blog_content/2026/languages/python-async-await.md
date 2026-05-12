---
title: Python Async/Await : Optimiser vos applications I/O-bound
date: 2024-12-05
author: Daya SYLLA
category: Python
tags: [Python, Async, Asyncio, Performance, Concurrency]
---

# Python Async/Await : Optimiser vos applications I/O-bound

L'asyncio de Python permet d'écrire du code concurrent efficace pour les opérations I/O-bound. Découvrez comment l'utiliser pour améliorer les performances de vos applications.

## Pourquoi Async/Await ?

### Problème avec le threading classique

Le threading Python souffre du GIL (Global Interpreter Lock), limitant l'exécution parallèle de code CPU-bound. Cependant, pour les opérations I/O (réseau, fichiers, bases de données), async/await est beaucoup plus efficace.

### Avantages de l'asyncio

- **Concurrence** : Gérer des milliers de connexions simultanées
- **Performance** : Pas de overhead du threading
- **Simplicité** : Syntaxe claire et lisible

## Concepts de base

### Coroutines

```python
import asyncio

async def fetch_data(url: str):
    # Simulation d'une requête HTTP
    await asyncio.sleep(1)
    return f"Data from {url}"

# Exécution
result = await fetch_data("https://api.example.com")
```

### Event Loop

L'event loop gère l'exécution des coroutines :

```python
async def main():
    tasks = [
        fetch_data("url1"),
        fetch_data("url2"),
        fetch_data("url3")
    ]
    results = await asyncio.gather(*tasks)
    return results

# Lancer l'event loop
results = asyncio.run(main())
```

## Cas d'usage pratiques

### 1. Requêtes HTTP concurrentes

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

### 2. Accès base de données

```python
import asyncpg

async def fetch_users():
    conn = await asyncpg.connect('postgresql://...')
    users = await conn.fetch('SELECT * FROM users')
    await conn.close()
    return users
```

### 3. Traitement de fichiers

```python
import aiofiles

async def read_file(filepath):
    async with aiofiles.open(filepath, 'r') as f:
        content = await f.read()
    return content
```

## Performance : Async vs Threading

Pour 1000 requêtes HTTP :
- **Threading** : ~10 secondes (limité par le GIL)
- **Async** : ~1 seconde (concurrence réelle)

## Bonnes pratiques

1. **Utilisez async/await pour I/O** : Réseau, fichiers, DB
2. **Évitez pour CPU-bound** : Utilisez multiprocessing
3. **Gérez les erreurs** : try/except dans les coroutines
4. **Limitez la concurrence** : Utilisez semaphores pour éviter la surcharge

```python
semaphore = asyncio.Semaphore(10)

async def limited_fetch(url):
    async with semaphore:
        return await fetch(url)
```

## Conclusion

Async/await transforme Python en un langage puissant pour les applications I/O-bound. Maîtrisez ces concepts pour construire des applications performantes et scalables.
