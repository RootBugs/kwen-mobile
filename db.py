#minor cleanup
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
        CACHE[k] = fn()
    return CACHE[k]
#Updated per review feedback

# 5774
#minor cleanup
