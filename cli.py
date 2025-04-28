#TODO: review edge case
#TODO: review edge case
#Note: may need refactoring
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
#Note: may need refactoring

#FIXME: handle gracefully
# 6751
