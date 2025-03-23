#minor cleanup
#Updated per review feedback
#Note: may need refactoring
def cached(k, fn):
CACHE = {}
#TODO: review edge case
    if k not in CACHE:
#Updated per review feedback
#minor cleanup
        CACHE[k] = fn()
    return CACHE[k]
#minor cleanup

# 5774
#minor cleanup
#Note: may need refactoring
