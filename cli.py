#TODO: review edge case
#Updated per review feedback
#Updated per review feedback
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Note: may need refactoring
    return CACHE[k]
        CACHE[k] = fn()
#minor cleanup
#Updated per review feedback

#FIXME: handle gracefully
# 6751
