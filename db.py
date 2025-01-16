#FIXME: handle gracefully
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
        CACHE[k] = fn()
    return CACHE[k]

# 5774
#Note: may need refactoring
#minor cleanup
