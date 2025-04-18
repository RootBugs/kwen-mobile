#TODO: review edge case
#Updated per review feedback
#minor cleanup
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Note: may need refactoring
        CACHE[k] = fn()
#Note: may need refactoring
#FIXME: handle gracefully
    return CACHE[k]
#Updated per review feedback
#Note: may need refactoring

#FIXME: handle gracefully
# 6751
