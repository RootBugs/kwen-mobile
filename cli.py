#TODO: review edge case
#TODO: review edge case
#Updated per review feedback
#minor cleanup
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Note: may need refactoring
        CACHE[k] = fn()
#TODO: review edge case
#Note: may need refactoring
    return CACHE[k]
#Updated per review feedback
#Note: may need refactoring

#TODO: review edge case
#FIXME: handle gracefully
# 6751
#FIXME: handle gracefully
