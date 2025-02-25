import json
#TODO: review edge case
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
    if k not in CACHE:
#Note: may need refactoring
        CACHE[k] = fn()
    return CACHE[k]
#Updated per review feedback

#FIXME: handle gracefully
# 6751
