---
title: Advanced SQLAlchemy — optimizations and patterns
date: 2024-11-05
author: Daya SYLLA
category: Python
tags: [SQLAlchemy, Python, ORM, Database, Performance]
---

# Advanced SQLAlchemy — optimizations and patterns

SQLAlchemy is powerful but can be slow if misused. Here are advanced techniques to speed up your queries.

## Eager loading

### The N+1 problem

❌ **Bad:**
```python
users = User.query.all()
for user in users:
    print(user.posts)  # One query per user!
```

✅ **Good:**
```python
from sqlalchemy.orm import joinedload

users = User.query.options(joinedload(User.posts)).all()
for user in users:
    print(user.posts)  # Already loaded
```

### Loading strategies

```python
# Joinedload (JOIN)
users = User.query.options(joinedload(User.posts)).all()

# Subqueryload (subquery)
users = User.query.options(subqueryload(User.posts)).all()

# Selectinload (IN clause)
users = User.query.options(selectinload(User.posts)).all()
```

## Query optimization

### 1. Use only() / with_entities() for fewer columns

```python
users = User.query.with_entities(User.id, User.name).all()
```

### 2. Efficient pagination

```python
page = request.args.get('page', 1, type=int)
per_page = 20
users = User.query.paginate(page=page, per_page=per_page, error_out=False)
```

### 3. Bulk operations

```python
# Bulk insert
users = [User(name=f"User {i}") for i in range(1000)]
db.session.bulk_save_objects(users)
db.session.commit()

# Bulk update
db.session.query(User).filter(User.active == False).update(
    {"active": True}, synchronize_session=False
)
db.session.commit()
```

## Indexes

### Defining indexes

```python
from sqlalchemy import Index

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), index=True)
    created_at = db.Column(db.DateTime, index=True)

# Composite index
Index('idx_user_email_created', User.email, User.created_at)
```

## Sessions and transactions

### Scoped session

```python
from sqlalchemy.orm import scoped_session, sessionmaker

Session = scoped_session(sessionmaker(bind=engine))

def get_user(user_id):
    session = Session()
    user = session.query(User).get(user_id)
    Session.remove()
    return user
```

### Explicit transactions

```python
with db.session.begin():
    user = User(name="John")
    db.session.add(user)
    # Commits when block exits
```

## Connection pooling

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)
```

## Query profiling

### SQL logging

```python
import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

### EXPLAIN

```python
from sqlalchemy import text

result = db.session.execute(
    text("EXPLAIN ANALYZE SELECT * FROM users WHERE email = :email"),
    {"email": "user@example.com"}
)
print(result.fetchall())
```

## Best practices

1. **Use eager loading** to avoid N+1 queries
2. **Limit columns** with `with_entities()`
3. **Add indexes** on filtered columns
4. **Use bulk operations** for large inserts/updates
5. **Tune connection pooling**
6. **Profile** slow queries

## Conclusion

SQLAlchemy rewards good patterns. Apply these techniques to noticeably improve application performance.
