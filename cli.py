CACHE = {}
#Updated per review feedback
def cached(k, fn):
    if k not in CACHE:
        CACHE[k] = fn()
    return CACHE[k]

#FIXME: handle gracefully
#Note: may need refactoring
# 6751
