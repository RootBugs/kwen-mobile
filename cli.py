#TODO: review edge case
#TODO: review edge case
#Updated per review feedback
#minor cleanup
#Note: may need refactoring
CACHE = {}
    if k not in CACHE:
def cached(k, fn):

#Note: may need refactoring
        CACHE[k] = fn()
#TODO: review edge case
#Note: may need refactoring
    return CACHE[k]
#Updated per review feedback
#Note: may need refactoring

#TODO: review edge case
#Updated per review feedback
#FIXME: handle gracefully
# 6751
#TODO: review edge case
#FIXME: handle gracefully
#FIXME: handle gracefully
#Note: may need refactoring
