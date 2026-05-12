---
title: SQLAlchemy avancé : Optimisations et patterns
date: 2024-11-05
author: Daya SYLLA
category: Python
tags: [SQLAlchemy, Python, ORM, Database, Performance]
---

# SQLAlchemy avancé : Optimisations et patterns

SQLAlchemy est puissant mais peut être lent si mal utilisé. Découvrez les techniques avancées pour optimiser vos requêtes.

## Eager Loading

### Problème N+1

❌ **Mauvais :**
```python
users = User.query.all()
for user in users:
    print(user.posts)  # Requête pour chaque user !
```

✅ **Bon :**
```python
from sqlalchemy.orm import joinedload

users = User.query.options(joinedload(User.posts)).all()
for user in users:
    print(user.posts)  # Déjà chargé !
```

### Options de loading

```python
# Joinedload (JOIN)
users = User.query.options(joinedload(User.posts)).all()

# Subqueryload (sous-requête)
users = User.query.options(subqueryload(User.posts)).all()

# Selectinload (IN clause)
users = User.query.options(selectinload(User.posts)).all()
```

## Query Optimization

### 1. Utiliser only() pour limiter les colonnes

```python
# Charger uniquement les colonnes nécessaires
users = User.query.with_entities(User.id, User.name).all()
```

### 2. Pagination efficace

```python
# Utiliser offset/limit
page = request.args.get('page', 1, type=int)
per_page = 20
users = User.query.paginate(page=page, per_page=per_page, error_out=False)
```

### 3. Bulk Operations

```python
# Insertion en masse
users = [User(name=f"User {i}") for i in range(1000)]
db.session.bulk_save_objects(users)
db.session.commit()

# Mise à jour en masse
db.session.query(User).filter(User.active == False).update(
    {"active": True}, synchronize_session=False
)
db.session.commit()
```

## Indexes

### Créer des index

```python
from sqlalchemy import Index

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), index=True)
    created_at = db.Column(db.DateTime, index=True)

# Index composite
Index('idx_user_email_created', User.email, User.created_at)
```

## Sessions et Transactions

### Scoped Session

```python
from sqlalchemy.orm import scoped_session, sessionmaker

Session = scoped_session(sessionmaker(bind=engine))

# Utilisation thread-safe
def get_user(user_id):
    session = Session()
    user = session.query(User).get(user_id)
    Session.remove()  # Nettoyer
    return user
```

### Transactions

```python
# Transaction explicite
with db.session.begin():
    user = User(name="John")
    db.session.add(user)
    # Commit automatique à la fin du bloc
```

## Connection Pooling

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,          # Connexions dans le pool
    max_overflow=20,       # Connexions supplémentaires
    pool_pre_ping=True,    # Vérifier les connexions
    pool_recycle=3600      # Recycler après 1h
)
```

## Query Profiling

### Activer le logging SQL

```python
import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

### Utiliser EXPLAIN

```python
from sqlalchemy import text

result = db.session.execute(
    text("EXPLAIN ANALYZE SELECT * FROM users WHERE email = :email"),
    {"email": "user@example.com"}
)
print(result.fetchall())
```

## Best Practices

1. **Toujours utiliser eager loading** pour éviter N+1
2. **Limiter les colonnes** avec `with_entities()`
3. **Utiliser les index** pour les colonnes fréquemment filtrées
4. **Bulk operations** pour les insertions/mises à jour en masse
5. **Connection pooling** pour la performance
6. **Profiler les requêtes** lentes

## Conclusion

SQLAlchemy est puissant mais nécessite une utilisation optimale. Suivez ces patterns pour améliorer significativement les performances de vos applications.
