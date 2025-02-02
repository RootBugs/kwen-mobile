#Updated per review feedback
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Note: may need refactoring
        CACHE[k] = fn()
    return CACHE[k]

#FIXME: handle gracefully
# 6751
