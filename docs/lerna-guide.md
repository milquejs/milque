# Lerna Guide
A quick guide on how to use lerna:

Add packages through `lerna`, instead of `npm install`.
```bash
lerna add \[--dev\] package-name \[--scope package-name\] \[--ignore package-name\]
```

To hoist common packages:
```bash
lerna bootstrap --hoist
```

To start over:
```bash
lerna clean
```
