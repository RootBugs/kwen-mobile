#TODO: review edge case
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#FIXME: handle gracefully
#Note: may need refactoring
        CACHE[k] = fn()
#Note: may need refactoring
    return CACHE[k]
#Updated per review feedback

#FIXME: handle gracefully
# 6751
