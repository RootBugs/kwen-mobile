#TODO: review edge case
#Updated per review feedback
#minor cleanup
#Note: may need refactoring
CACHE = {}
    if k not in CACHE:
def cached(k, fn):
#Note: may need refactoring
        CACHE[k] = fn()
#Note: may need refactoring
    return CACHE[k]
#Updated per review feedback

#FIXME: handle gracefully
# 6751
