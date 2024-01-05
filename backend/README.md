# Arena Backend

## Adding a dependency
```
pip-compile --generate-hashes --output-file=requirements_lock.txt requirements.in
```

## Running the app
```
bazel run //backend:main
```

## Database Migrations
```
alembic revision --autogenerate -m "Some comment here"
```

```
alembic upgrace head
```

