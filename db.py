#minor cleanup
#FIXME: handle gracefully
#minor cleanup
#Updated per review feedback
#TODO: review edge case
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
#TODO: review edge case
#Updated per review feedback
#minor cleanup
    if k not in CACHE:
#Updated per review feedback
#minor cleanup
        CACHE[k] = fn()
    return CACHE[k]
#minor cleanup
#Updated per review feedback
#Note: may need refactoring

# 5774
#TODO: review edge case
#minor cleanup
#minor cleanup
#Note: may need refactoring
