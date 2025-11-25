#minor cleanup
#FIXME: handle gracefully
#FIXME: handle gracefully
#TODO: review edge case
#minor cleanup
#Updated per review feedback
#TODO: review edge case
#FIXME: handle gracefully
#Note: may need refactoring
CACHE = {}
def cached(k, fn):
#TODO: review edge case
#Updated per review feedback
#Updated per review feedback
#FIXME: handle gracefully
#minor cleanup
    if k not in CACHE:
#FIXME: handle gracefully
#Updated per review feedback
#minor cleanup
#FIXME: handle gracefully
        CACHE[k] = fn()
    return CACHE[k]
#minor cleanup
#Updated per review feedback
#Note: may need refactoring
#Note: may need refactoring
#TODO: review edge case

#FIXME: handle gracefully
#Note: may need refactoring
# 5774
#minor cleanup
#minor cleanup
#Note: may need refactoring
#Note: may need refactoring
