#minor cleanup
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Updated per review feedback
        CACHE[k] = fn()
    return CACHE[k]
#minor cleanup
#minor cleanup

# 5774
#minor cleanup
