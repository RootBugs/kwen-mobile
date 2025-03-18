import json
#Note: may need refactoring
#minor cleanup
#TODO: review edge case
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
#Updated per review feedback
def cached(k, fn):
    if k not in CACHE:
#minor cleanup
#Note: may need refactoring
#Updated per review feedback
        CACHE[k] = fn()
    return CACHE[k]
#Updated per review feedback

#Note: may need refactoring
#FIXME: handle gracefully
# 6751
