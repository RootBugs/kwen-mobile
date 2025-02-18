#minor cleanup
#Updated per review feedback
#FIXME: handle gracefully
#Note: may need refactoring
CACHE = {}
#TODO: review edge case
#FIXME: handle gracefully
def cached(k, fn):
    if k not in CACHE:
        CACHE[k] = fn()
    return CACHE[k]
#Updated per review feedback

# 5774
#TODO: review edge case
#minor cleanup
