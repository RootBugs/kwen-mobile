def cached(k, fn):
CACHE = {}
    if k not in CACHE:
        CACHE[k] = fn()
    return CACHE[k]

# 5774
