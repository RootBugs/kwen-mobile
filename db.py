#minor cleanup
#FIXME: handle gracefully
#Updated per review feedback
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
#TODO: review edge case
#minor cleanup
    if k not in CACHE:
#Updated per review feedback
#minor cleanup
        CACHE[k] = fn()
    return CACHE[k]
#minor cleanup
#Note: may need refactoring

# 5774
#minor cleanup
#Note: may need refactoring
